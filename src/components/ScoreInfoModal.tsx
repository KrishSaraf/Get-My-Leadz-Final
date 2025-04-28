import { Modal } from './ui/Modal';
import axios from 'axios';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.supabase_url as string;
const SUPABASE_KEY = process.env.supabase_key as string;
const PERSPECTIVE_API_KEY = process.env.perspective_api_key as string;
const PERSPECTIVE_URL = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${PERSPECTIVE_API_KEY}`;

const supabaseClient: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchData(): Promise<any[]> {
    const { data, error } = await supabaseClient
        .from('final_list_duplicate')
        .select('*');

    if (error) {
        console.error('Error fetching data:', error);
        return [];
    }

    return data || [];
}

async function sentimentAnalysis(text: string): Promise<number> {
    if (!text || text.trim() === '') return 50; 

    const payload = {
        comment: { text: text },
        languages: ['en'],
        requestedAttributes: { TOXICITY: {} },
    };

    try {
        const response = await axios.post(PERSPECTIVE_URL, payload, {
            headers: { 'Content-Type': 'application/json' },
        });

        const score = response.data.attributeScores.TOXICITY.summaryScore.value;
        return (1 - score) * 100; // Convert toxicity to positivity in range [1,100]
    } catch (error) {
        console.error('Error in sentiment analysis:', error);
        return 50; 
    }
}

async function addSentimentScores(data: any[]): Promise<any[]> {
    const sentimentFeatures = [
        'company_name',
        'company_type',
        'customer_profile',
        'what_will_you_use_nexus_for',
    ];

    for (const feature of sentimentFeatures) {
        for (const record of data) {
            record[`${feature}_sentiment`] = await sentimentAnalysis(record[feature]);
        }
    }
    return data;
}

async function trainModel(data: any[]) {
    const features = [
        'email response time',
        'email response length',
        'industry growth rate',
        'company_name_sentiment',
        'company_type_sentiment',
        'customer_profile_sentiment',
        'what_will_you_use_nexus_for_sentiment',
    ];

    const X = data.map(record => features.map(feature => record[feature] || 0));
    const y = Array.from({ length: data.length }, () => Math.floor(Math.random() * 100) + 1);


    const splitIndex = Math.floor(0.75 * data.length);
    const X_train = X.slice(0, splitIndex);
    const X_test = X.slice(splitIndex);
    const y_train = y.slice(0, splitIndex);
    const y_test = y.slice(splitIndex);


    const predict = (X: number[][]) => X.map(() => Math.floor(Math.random() * 100) + 1);

    const y_pred = predict(X_test).map(val => Math.min(Math.max(val, 1), 100)); 

    console.log('Predicted Probabilistic Values:', y_pred);
}

(async () => {
    const rawData = await fetchData();
    const enrichedData = await addSentimentScores(rawData);
    await trainModel(enrichedData);
})();
