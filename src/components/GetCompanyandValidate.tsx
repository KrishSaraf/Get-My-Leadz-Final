import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanies } from '../context/CompanyContext';
import { CompanyCard } from '../components/CompanyCard';
from supabase import create_client, Client
import perplexity_api as perplexity
import { LeadPreview } from '../components/LeadPreview';

dotenv.config();
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const LINKEDIN_API_KEY = process.env.LINKEDIN_API_KEY;
const CRUNCHBASE_API_KEY = process.env.CRUNCHBASE_API_KEY;
const YC_PUBLIC_API_KEY = process.env.YC_PUBLIC_API_KEY;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const supabase: SupabaseClient = createClient(SUPABASE_URL!, SUPABASE_KEY!);

const perplexity = {
  configure: (config: { api_key: string }) => {},
  sendQuery: async (query: string): Promise<{ text: string }> => {
    const response = await axios.post(
      "https://api.perplexity.ai/v1/query",
      { query },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    return { text: response.data.text };
  }
};

perplexity.configure({ api_key: PERPLEXITY_API_KEY! });
let existing_and_inbound_companies: string[] = [];

(async () => {
  try {
    const { data: inboundData } = await supabase.from("inbound_companies").select("company_name");
    const { data: reachedOutData } = await supabase.from("reached_out").select("company_name");
    const { data: useCasesData } = await supabase.from("nexus_ai_use_cases").select("company_name");
    const companies_from_inbound = inboundData ? inboundData.map((record: any) => record.company_name) : [];
    const companies_from_reached = reachedOutData ? reachedOutData.map((record: any) => record.company_name) : [];
    const companies_from_use_cases = useCasesData ? useCasesData.map((record: any) => record.company_name) : [];
    const combined_companies = Array.from(new Set([...companies_from_inbound, ...companies_from_reached, ...companies_from_use_cases]));
    existing_and_inbound_companies.push(...combined_companies);
  } catch (e) {
    console.error(`Error fetching data from Supabase: ${e}`);
  }
})();

async function get_data_from_accra(company_name: string): Promise<any> {
  const { data: records } = await supabase.from("accra_documents").select("*").eq("company_name", company_name);
  if (!records || records.length === 0) return {};
  const pdf_file = records[0].pdf_file;
  if (!pdf_file) return {};
  let pdfBytes: Uint8Array;
  if (typeof pdf_file === "string") {
    pdfBytes = Uint8Array.from(atob(pdf_file), (c) => c.charCodeAt(0));
  } else {
    pdfBytes = pdf_file;
  }
  const loadingTask = getDocument({ data: pdfBytes });
  const pdf = await loadingTask.promise;
  let pagesText: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    pagesText.push(pageText);
  }
  const combinedText = pagesText.join(" ");
  return {
    "Accra_RegisteredName": company_name,
    "Accra_FilingStatus": "Active",
    "Accra_Details": combinedText
  };
}

async function get_data_from_linkedin(company_name: string): Promise<any> {
  const headers = {
    Authorization: `Bearer ${LINKEDIN_API_KEY}`,
    "Content-Type": "application/json"
  };
  const url = `https://api.linkedin.com/v2/organizations?q=organizationLookup&organization=${company_name}`;
  try {
    const response = await fetch(url, { headers });
    if (response.ok) {
      const data = await response.json();
      return {
        "LinkedIn_OrgID": data.elements && data.elements[0] ? data.elements[0].id || "" : "",
        "LinkedIn_Description": data.elements && data.elements[0] ? data.elements[0].description || "" : ""
      };
    }
  } catch (error) {
    console.error(error);
  }
  return {};
}

async function get_data_from_crunchbase(company_name: string): Promise<any> {
  const headers = {
    "X-CB-User-Key": CRUNCHBASE_API_KEY || "",
    "Content-Type": "application/json"
  };
  const url = `https://api.crunchbase.com/v3.1/organizations/${company_name.toLowerCase()}`;
  try {
    const response = await fetch(url, { headers });
    if (response.ok) {
      const data = await response.json();
      return {
        "Crunchbase_Funding": data.data?.properties?.total_funding_usd || "",
        "Crunchbase_Investors": data.data?.relationships?.investors?.items || []
      };
    }
  } catch (error) {
    console.error(error);
  }
  return {};
}

async function get_data_from_ycombinator(company_name: string): Promise<any> {
  const headers = {
    Authorization: `Bearer ${YC_PUBLIC_API_KEY}`,
    Accept: "application/json"
  };
  const url = `https://api.ycombinator.com/v1/companies?search=${company_name}`;
  try {
    const response = await fetch(url, { headers });
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return {
          "YC_Batch": data.results[0].batch || "",
          "YC_Status": data.results[0].status || ""
        };
      }
    }
  } catch (error) {
    console.error(error);
  }
  return {};
}

async function get_related_company_name(country: string, target: string): Promise<string> {
  const prompt = `
        Provide the name of a single company located in ${country}, similar to ${target}, that is NOT in this list:
        ${JSON.stringify(existing_and_inbound_companies)}
        Only return the company name, nothing else.
    `;
  const response = await perplexity.sendQuery(prompt);
  const data = JSON.parse(response.text);
  const company_name = data.company_name || "UnknownCo";
  existing_and_inbound_companies.push(company_name);
  return company_name;
}

async function get_country(company: string): Promise<string> {
  const prompt = `Get the country of listing for the following company: ${company}`;
  const response = await perplexity.sendQuery(prompt);
  const data = JSON.parse(response.text);
  return data.country || "Private";
}

async function cross_validate_and_insert(company_info: any, company_name: string): Promise<void> {
  const accra_data = await get_data_from_accra(company_name);
  const linkedin_data = await get_data_from_linkedin(company_name);
  const crunchbase_data = await get_data_from_crunchbase(company_name);
  const ycombinator_data = await get_data_from_ycombinator(company_name);
  const merged_data = {
    ...company_info,
    ...accra_data,
    ...linkedin_data,
    ...crunchbase_data,
    ...ycombinator_data
  };
  const { data, error } = await supabase.from("outbound_leads").insert(merged_data);
  console.log(`Pushed ${merged_data["Company Name"] || company_name} to Supabase:`, { data, error });
}

async function get_outbound_leads(): Promise<void> {
  const csv_headers = [
    "Company Name", "Country of Listing/Incorporation", "Name", "Email", "Role of Contact",
    "Location of Contact", "Description", "Revenue (USD)", "Net Income (USD)", "Company Industry",
    "Customer Profile", "Score", "Industry Growth Rate", "Company Exchange Code if Listed",
    "Source", "Intention"
  ];
  for (const company_name of existing_and_inbound_companies) {
    const country = await get_country(company_name);
    const similar_company = await get_related_company_name(country, company_name);
    const prompt = `
            1. Generate detailed and up-to-date information for ${similar_company}. If you determine that ${similar_company} is a subsidiary company,
            generate information for its parent company instead.
            - Google search for ${similar_company} and extract information from the first 5-10 links.
            - Find a person who works at ${similar_company}, and use LinkedIn to get their email, role, and location.
            Prioritize official company site, investor reports, recent articles, etc.
            2. Provide output as JSON with these fields:
            {
                "Company Name": "Company Name",
                "Country of Listing/Incorporation": "Country print Private if not listed",
                "Name": "Contact person name",
                "Email": "Contact email",
                "Role of Contact": "Contact role",
                "Location of Contact": "Contact location",
                "Description": "Detailed Business Description. 2 lines max",
                "Revenue (USD)": "Revenue in USD",
                "Net Income (USD)": "Net Income in USD",
                "Company Industry": "Industry",
                "Customer Profile": "Customer profile",
                "Score": "Public Sentiment Score (0-100)",
                "Industry Growth Rate": "Industry Growth Rate (max 15%)",
                "Company Exchange Code if Listed": "XXXX",
                "Source": "Lead source",
                "Intention": "Lead's intention"
            }
            No null fields. No extra text. Output must be valid JSON only.
        `;
    const perplexity_response = await perplexity.sendQuery(prompt);
    try {
      const response_data = JSON.parse(perplexity_response.text);
      const company_info: any = {};
      for (const key of csv_headers) {
        company_info[key] = response_data[key] || "Not Specified";
      }
      await cross_validate_and_insert(company_info, similar_company);
    } catch (e) {
      console.error(`Error decoding JSON for ${similar_company}:`, e);
      console.error("Raw response:", perplexity_response.text);
    }
  }
}

const App: React.FC = () => {
  useEffect(() => {
    (async () => {
      await get_outbound_leads();
    })();
  }, []);
  return (
    <div>
      <h1>Outbound Leads Process</h1>
      <p>Processing outbound leads. Check console for details.</p>
    </div>
  );
};

export default App;


