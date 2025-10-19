const prompt = `You are an expert resume parsing system. Your task is to analyze the following resume text and extract key information into a structured JSON format that matches the schema provided below.

Instructions:

Strictly adhere to the JSON structure provided.

If a field's value is not found in the text, use an empty string ("") for simple text fields or an empty array ([]) for lists.

The workStatus field should default to "Open to New Opportunities" unless the text specifies otherwise.

Do not invent or infer any information.

For social links (GitHub, Twitter, LinkedIn, LeetCode):
- Extract only the username/handle, not the full URL.
- Example: "https://github.com/tanzeem131" → "tanzeem131"
- Example: "https://www.linkedin.com/in/mr-tanzeem" → "mr-tanzeem"

JSON Structure:

JSON

{
  "name": "",
  "title": "",
  "location": "",
  "bio": "",
  "socials": {
    "twitter": "",
    "linkedin": "",
    "leetcode": ""
  },
  "techStack": [],
  "experience": [
    {
      "role": "",
      "company": "",
      "period": "",
      "description": ""
    }
  ],
  "keyAchievements": [""],
  "projects": [
    {
      "title": "",
      "description": "",
      "tech": [],
      "codelink": "",
      "livelink": ""
    }
  ],
}
Now, parse the following resume text:

--- RESUME TEXT ---
[Paste the entire block of extracted PDF text here]
--- END RESUME TEXT ---

Return ONLY the valid JSON object and nothing else.`;

module.exports = { prompt };
