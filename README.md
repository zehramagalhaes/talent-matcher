# 🌟 TalentMatcher

> **Where skills meet opportunities.**  
> AI-powered resume and job description compatibility analyzer.

---

## 📖 Overview

**TalentMatcher** is a web application built with **Next.js** and **Material UI** that helps candidates and recruiters evaluate the compatibility between resumes and job postings.  

Upload your **resume** and a **job description** (`.md` or `.html`), and TalentMatcher will:

- 📂 Extract relevant experiences and job requirements  
- 🧑‍💼 Generate a recruiter persona (`tech_recruiter.md`)  
- 📝 Create a structured job file (`job123.md`)  
- 🤖 Use the **Gemini API (agent anti gravity)** to analyze compatibility  
- 📊 Provide a detailed report with strengths, gaps, and improvement suggestions  

Designed with **SOLID principles** and **Clean Code**, TalentMatcher offers a scalable and maintainable architecture for future growth.

---

## ✨ Features

- **Resume Upload** → Supports `.pdf` and `.docx`  
- **Job Description Upload** → Supports `.md` and `.html`  
- **AI-Powered Analysis** → Gemini API integration for compatibility reports  
- **Modern UI** → Built with the latest **Material UI** components  
- **Clean Architecture** → Following SOLID and Clean Code guidelines  
- **Deployable on GitHub Pages** → Easy hosting and sharing  

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)  
- **UI Library**: [Material UI](https://mui.com/)  
- **Language**: TypeScript  
- **AI Integration**: Gemini API (agent anti gravity)  
- **Deployment**: GitHub Pages

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/zehramagalhaes/talentmatcher.git
cd talentmatcher
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a ``.env.local`` file with this value:

```GEMINI_API_KEY=your_api_key_here```

### 4. Run the app
```bash
npm run dev
```

## 📜 License
This project is licensed under the MIT License.
Feel free to use, modify, and distribute.

## 🌟 Acknowledgments
- Built with ❤️ using Next.js and Material UI
- Powered by Gemini API
- Inspired by the mission to connect talent with opportunity
