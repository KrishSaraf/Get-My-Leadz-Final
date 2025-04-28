import { EmailInteraction } from '../types';

export const emailInteractions: EmailInteraction[] = [
  {
    id: '1',
    from: {
      name: 'Sarah Chen',
      email: 'sarah.chen@griffithuni.edu.au'
    },
    to: {
      name: 'NexusAI Team',
      email: 'support@nexusai.com'
    },
    subject: 'Inquiry About NexusAI Features for Students',
    initialMessage: {
      content: "Hello NexusAI Team,\n\nI've recently heard about your platform through my university's tech group, and I'm intrigued by the possibility of using AI to streamline my studies. Could you tell me more about what NexusAI is and the main tools it offers? Also, how might NexusAI help me manage research papers or group assignments?\n\nThanks, and I look forward to learning more about how NexusAI could benefit a student like me.\n\nBest regards,\nSarah Chen",
      date: '19/03/2025',
      time: '3:14:27'
    },
    response: {
      content: "Thank you for your interest in Nexus AI. We're excited to help you discover how our AI solutions can transform your workflow.\nPlease let me know if you have any specific questions about our services.\n\nThannks,\nNexusAI Team",
      date: '19/03/2025',
      time: '10:12:39'
    },
    reply: {
      content: "Hello Nexus AI Team,\n\nThank you so much for the prompt response. I'm absolutely thrilled! I feel like NexusAI might be exactly what I need to manage my classes and group assignments more efficiently. Is there a step-by-step guide or demo I could use to start exploring the platform right away? Also, do you offer any student discounts?\n\nI can't wait to dive in and see how NexusAI can transform my academic life.\n\nBest regards,\nSarah Chen",
      responseTimeHours: 7
    },
    leadScore: 0.942,
    explanation: "High enthusiasm and relatively quick response (7 hours). Sarah specifically requests demos and discounts, showing immediate interest. The combination of urgency, curiosity, and fairly prompt reply suggests a strong chance she'll convert."
  },
  {
    id: '2',
    from: {
      name: 'Jeremy Tatham',
      email: 'jeremy.tath@student.uq.edu.au'
    },
    to: {
      name: 'NexusAI Team',
      email: 'support@nexusai.com'
    },
    subject: 'General Query: How NexusAI Can Help Students',
    initialMessage: {
      content: "Hi NexusAI Team,\n\nI'm Jeremy, a second-year business student. I keep hearing about AI-driven solutions but have never tried them myself. Could you give me a quick overview of what NexusAI does? More importantly, do you think it can help me with general coursework, research, and presentation tasks?\n\nHoping to hear from you soon!\n\nThank you,\nJeremy Tatham",
      date: '20/03/2025',
      time: '7:59:08'
    },
    response: {
      content: "Thank you for your interest in Nexus AI. We're excited to help you discover how our AI solutions can transform your workflow.\nPlease let me know if you have any specific questions about our services.\n\nThannks,\nNexusAI Team",
      date: '20/03/2025',
      time: '19:50:18'
    },
    reply: {
      content: "Hi Nexus AI Team,\n\nThanks for getting back to me. I'm definitely intrigued—I just don't have a lot of time to figure out complicated new software. Do you have a \"Getting Started\" video or a set of basic tutorials? I'd like to see how quickly I can integrate this into my weekly assignments and presentations without a steep learning curve.\n\nI appreciate your help!\n\nThanks,\nJeremy Tatham",
      responseTimeHours: 12
    },
    leadScore: 0.715,
    explanation: "Jeremy shows notable interest in simplicity and a manageable learning curve. Although he took 12 hours to respond, which is moderate, his content indicates he's open to adopting the service as long as it's easy to integrate into his busy schedule."
  },
  {
    id: '3',
    from: {
      name: 'Laura Fitzgerald',
      email: 'laura.fitzgerald@sheffield.ac.uk'
    },
    to: {
      name: 'NexusAI Team',
      email: 'support@nexusai.com'
    },
    subject: "Wondering About NexusAI's Capabilities for Students",
    initialMessage: {
      content: "Dear NexusAI Support,\n\nI'm Laura Fitzgerald, a postgraduate student juggling a busy schedule of coursework and research. I came across NexusAI in an online forum but would love more details on what exactly it does. Could you please share how NexusAI might simplify a typical student's workflow, such as organizing references or handling group projects?\n\nThank you so much,\nLaura Fitzgerald",
      date: '20/03/2025',
      time: '12:23:45'
    },
    response: {
      content: "Thank you for your interest in Nexus AI. We're excited to help you discover how our AI solutions can transform your workflow.\nPlease let me know if you have any specific questions about our services.\n\nThannks,\nNexusAI Team",
      date: '21/03/2025',
      time: '4:36:19'
    },
    reply: {
      content: "Hello Nexus AI Support,\n\nThank you for your reply! I'm curious about how your tools could specifically help someone in postgraduate studies. Do you have features tailored for academic writing or co-authoring? I'm also trying to handle multiple reference styles—can NexusAI help with that, or will I need a separate tool?\n\nThanks again, and I look forward to more details.\n\nSincerely,\nLaura Fitzgerald",
      responseTimeHours: 16
    },
    leadScore: 0.812,
    explanation: "Despite taking 16 hours to reply, Laura's inquiries suggest she's genuinely evaluating NexusAI for advanced academic tasks. Her questions about writing and references show clear intent, indicating a fairly high potential despite the longer response gap."
  },
  {
    id: '4',
    from: {
      name: 'Tayzaar Toe Wai',
      email: 'Tayzaar001@e.ntu.edu.sg'
    },
    to: {
      name: 'NexusAI Team',
      email: 'support@nexusai.com'
    },
    subject: 'Questions About NexusAI Services & Student Benefits',
    initialMessage: {
      content: "Hello NexusAI Team,\n\nMy name is Tayzaar, and I'm a master's student in the field of data analytics. I've heard NexusAI offers various AI-powered tools, but I'm unsure which ones could best help someone like me. Can you share a brief overview of NexusAI's features and how they might assist with research projects or day-to-day homework tasks?\n\nLooking forward to your response.\n\nBest regards,\nTayzaar Toe Wai",
      date: '20/03/2025',
      time: '14:52:09'
    },
    response: {
      content: "Thank you for your interest in Nexus AI. We're excited to help you discover how our AI solutions can transform your workflow.\nPlease let me know if you have any specific questions about our services.\n\nThannks,\nNexusAI Team",
      date: '21/03/2025',
      time: '3:02:22'
    },
    reply: {
      content: "Hi NexusAI Team,\n\nThanks for getting in touch! I'm really looking forward to incorporating advanced AI solutions into my data analytics projects. Do you have an API or SDK that I could integrate with my existing Python scripts? Additionally, I'd love to know if there's a community or forum where I can share code snippets and get feedback from other users.\n\nBest regards,\nTayzaar Toe Wai",
      responseTimeHours: 12
    },
    leadScore: 0.916,
    explanation: "Tayzar's 12-hour response is moderate, but his technical depth of questioning (API, SDK, community) shows serious intent to adopt or integrate NexusAI. That level of engagement and specialized inquiry usually signals a high likelihood of conversion."
  },
  {
    id: '5',
    from: {
      name: 'Sarah Williams',
      email: 'sarah.williams@ncl.ac.uk'
    },
    to: {
      name: 'NexusAI Team',
      email: 'support@nexusai.com'
    },
    subject: 'NexusAI Inquiry: What Is It & How Can It Help My Thesis?',
    initialMessage: {
      content: "Hello Team NexusAI,\n\nI'm Sarah Williams, a final-year student gearing up for my thesis. While I've heard AI solutions can help simplify research and writing, I'd appreciate a clearer sense of what NexusAI is all about. Which of your services would be most relevant to a student doing extensive literature reviews and data analysis? Any guidance is greatly appreciated!\n\nWarm regards,\nSarah Williams",
      date: '20/03/2025',
      time: '18:06:31'
    },
    response: {
      content: "Thank you for your interest in Nexus AI. We're excited to help you discover how our AI solutions can transform your workflow.\nPlease let me know if you have any specific questions about our services.\n\nThannks,\nNexusAI Team",
      date: '21/03/2025',
      time: '2:22:39'
    },
    reply: {
      content: "Hello Nexus AI Team,\n\nI appreciate the response. I'm still not entirely convinced AI tools would fit seamlessly with my current thesis process. Could you point me toward case studies or success stories showing how your solutions help final-year or graduate-level research? I'd like to see concrete examples before I invest time in setting it up.\n\nThanks,\nSarah Williams",
      responseTimeHours: 8
    },
    leadScore: 0.55,
    explanation: "Sarah responded within 8 hours, which is fairly prompt, but her request for proof (case studies) and lingering doubts about AI's usefulness signals a mixed level of interest. She's open-minded yet cautious, placing her in a moderate lead range."
  },
  {
    id: '6',
    from: {
      name: 'Siddhanth Manoj',
      email: 'MA0001th@e.ntu.edu.sg'
    },
    to: {
      name: 'NexusAI Team',
      email: 'support@nexusai.com'
    },
    subject: 'General Inquiry: What Does NexusAI Offer to Students?',
    initialMessage: {
      content: "Dear NexusAI,\n\nI'm Siddhanth, an undergrad student just getting my feet wet with AI. I keep seeing mention of \"NexusAI\" around campus. Could you give me a quick breakdown of your core platform and what kind of help it provides to students? I'd also love to know if it's beginner-friendly for someone without a technical background.\n\nThank you in advance,\nSiddhanth Manoj",
      date: '21/03/2025',
      time: '15:49:03'
    },
    response: {
      content: "Thank you for your interest in Nexus AI. We're excited to help you discover how our AI solutions can transform your workflow.\nPlease let me know if you have any specific questions about our services.\n\nThannks,\nNexusAI Team",
      date: '21/03/2025',
      time: '15:50:19'
    },
    reply: {
      content: "Hey NexusAI,\n\nThanks for emailing me back. I've been thinking it over, and I'm not sure I really need AI tools right now. My workload isn't too heavy, and I'm pretty comfortable with my current study methods. I'll keep your info on file just in case, but I probably won't be exploring anything further in the near future.\n\nTake care,\nSiddhanth Manoj",
      responseTimeHours: 0.03
    },
    leadScore: 0.3,
    explanation: "Despite responding almost immediately (within 2 minutes), Siddhanth clearly states they do not currently need AI tools, feel comfortable with their existing study methods, and have no immediate plans to explore further. The extremely fast response time often signals high engagement, but in this case, the content of the message strongly indicates low intent to adopt NexusAI. Consequently, while the speed of reply would usually raise the lead score, the lack of interest in the service ultimately keeps the score relatively low."
  }
];