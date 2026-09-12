export const keyboardSkills = [
  { objectName: "js", name: "JavaScript", category: "Language", context: "Core Technology", color: "#f7df1e", description: "Interaction, application logic, and browser APIs." },
  { objectName: "ts", name: "TypeScript", category: "Language", context: "Core Technology", color: "#3178c6", description: "Typed application architecture for reliable interfaces and services." },
  { objectName: "html", name: "HTML5", category: "Frontend", context: "Interface", color: "#e34f26", description: "Semantic structure for accessible, resilient web experiences." },
  { objectName: "css", name: "CSS3", category: "Frontend", context: "Interface", color: "#1572b6", description: "Responsive layout, visual systems, and motion-ready styling." },
  { objectName: "react", name: "React", category: "Frontend", context: "Core Technology", color: "#61dafb", description: "Component architecture and expressive interfaces." },
  { objectName: "vue", name: "Three.js", category: "3D Web", context: "Experience", color: "#eef2f7", description: "Interactive 3D scenes and spatial interfaces in the browser." },
  { objectName: "nextjs", name: "Python", category: "Language", context: "Backend", color: "#3776ab", description: "Automation, application services, and data-focused development." },
  { objectName: "tailwind", name: "Flask", category: "Backend", context: "Server", color: "#eef2f7", description: "Lightweight Python services and REST API foundations." },
  { objectName: "nodejs", name: "Node.js", category: "Backend", context: "Runtime", color: "#68a063", description: "Backend services and full-stack application layers." },
  { objectName: "express", name: "Express", category: "Backend", context: "Server", color: "#d8dee9", description: "Lean routing and API foundations for web services." },
  { objectName: "postgres", name: "PostgreSQL", category: "Database", context: "Data", color: "#4169e1", description: "Structured data and dependable relational systems." },
  { objectName: "mongodb", name: "MongoDB", category: "Database", context: "Data", color: "#47a248", description: "Flexible data models for product iteration." },
  { objectName: "git", name: "Git", category: "Workflow", context: "Tooling", color: "#f05032", description: "Versioned, collaborative, deliberate delivery." },
  { objectName: "github", name: "GitHub", category: "Workflow", context: "Tooling", color: "#eef2f7", description: "Open-source collaboration and project history." },
  { objectName: "prettier", name: "SQL", category: "Language", context: "Data", color: "#8bb8e8", description: "Queries, relational thinking, and data shaping." },
  { objectName: "npm", name: "Java", category: "Language", context: "Application Development", color: "#ed8b00", description: "Object-oriented application development and problem solving." },
  { objectName: "firebase", name: "C", category: "Language", context: "Foundations", color: "#8bb8e8", description: "Systems fundamentals and disciplined programming practice." },
  { objectName: "wordpress", name: "REST APIs", category: "Backend", context: "Integration", color: "#8bb8e8", description: "Connecting products and services through clear interfaces." },
  { objectName: "linux", name: "VS Code", category: "Workflow", context: "Tooling", color: "#23a8f2", description: "The editor and environment used to shape each build." },
  { objectName: "docker", name: "Docker", category: "DevOps", context: "Containers", color: "#2496ed", description: "Portable development and deployment environments." },
  { objectName: "nginx", name: "Postman", category: "Workflow", context: "API Testing", color: "#ff6c37", description: "Testing, documenting, and validating service contracts." },
  { objectName: "aws", name: "Figma", category: "Design", context: "Product Thinking", color: "#f24e1e", description: "Exploring and refining interface systems before implementation." },
  { objectName: "vim", name: "MySQL", category: "Database", context: "Data", color: "#4479a1", description: "Relational data for practical application development." },
  { objectName: "vercel", name: "JavaScript", category: "Language", context: "Core Technology", color: "#f7df1e", description: "Interaction, application logic, and browser APIs." },
];

export const skillsByObjectName = Object.fromEntries(
  keyboardSkills.map((skill) => [skill.objectName, skill]),
);

export const skillObjectNames = new Set(keyboardSkills.map((skill) => skill.objectName));
