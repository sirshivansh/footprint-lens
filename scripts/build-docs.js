const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked options for GFM support, line breaks, etc.
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false
});

// Configure marked to render custom heading IDs for easy linking
const renderer = new marked.Renderer();
renderer.heading = function(arg1, arg2, arg3) {
  let text, level, raw;
  if (typeof arg1 === 'object' && arg1 !== null) {
    text = arg1.text;
    level = arg1.depth || arg1.level;
    raw = arg1.raw || arg1.text;
  } else {
    text = arg1;
    level = arg2;
    raw = arg3 || arg1;
  }
  const cleanId = (raw || text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[-\s]+/g, '-');
  return `<h${level} id="${cleanId}">${text}</h${level}>`;
};
marked.use({ renderer });

const docsDir = path.join(__dirname, '..', 'docs');
const templatePath = path.join(__dirname, '..', 'docs-site', 'template.html');
const outputDir = path.join(__dirname, '..', 'public', 'docs');
const outputPath = path.join(outputDir, 'index.html');

// Define document metadata and ordering
const docFiles = [
  { id: 'readme', filename: 'README.md', title: 'Overview', category: 'Overview' },
  { id: 'product-design', filename: 'product_design.md', title: 'Product Design', category: 'Design' },
  { id: 'uiux', filename: 'uiux.md', title: 'UI/UX Scheme', category: 'Design' },
  { id: 'technical-requirements', filename: '01_technical_requirements.md', title: '01. Technical Requirements', category: 'Specification' },
  { id: 'system-architecture', filename: '02_system_architecture.md', title: '02. System Architecture', category: 'Architecture' },
  { id: 'database-design', filename: '03_database_design.md', title: '03. Database Design', category: 'Architecture' },
  { id: 'api-specification', filename: '04_api_specification.md', title: '04. API Specification', category: 'Architecture' },
  { id: 'development-roadmap', filename: '05_development_roadmap.md', title: '05. Development Roadmap', category: 'Project Lifecycle' },
  { id: 'devops-deployment', filename: '06_devops_deployment.md', title: '06. DevOps & Deployment', category: 'Project Lifecycle' },
  { id: 'security-design', filename: '07_security_design.md', title: '07. Security Design', category: 'Specification' },
  { id: 'testing-strategy', filename: '08_testing_strategy.md', title: '08. Testing Strategy', category: 'Specification' },
  { id: 'project-structure', filename: '09_project_structure.md', title: '09. Project Structure', category: 'Specification' },
  { id: 'ai-development-context', filename: '10_ai_development_context.md', title: '10. AI Development Context', category: 'Overview' }
];

function build() {
  console.log('Starting documentation build process...');

  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found at: ${templatePath}`);
    process.exit(1);
  }

  let templateContent = fs.readFileSync(templatePath, 'utf8');

  // Parse all markdown files
  const compiledDocs = docFiles.map((doc) => {
    const filePath = path.join(docsDir, doc.filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: File not found at ${filePath}`);
      return { ...doc, html: '<p>Document content not found.</p>', rawContent: '' };
    }

    const rawContent = fs.readFileSync(filePath, 'utf8');
    const html = marked.parse(rawContent);

    return {
      ...doc,
      html,
      rawContent
    };
  });

  // Generate Navigation Sidebar HTML
  // Group by category
  const categories = {};
  compiledDocs.forEach((doc) => {
    if (!categories[doc.category]) {
      categories[doc.category] = [];
    }
    categories[doc.category].push(doc);
  });

  let sidebarHtml = '';
  Object.keys(categories).forEach((category) => {
    sidebarHtml += `<div class="sidebar-category">
      <h3 class="category-title">${category}</h3>
      <ul class="category-list">`;
    
    categories[category].forEach((doc) => {
      sidebarHtml += `
        <li class="sidebar-item" data-id="${doc.id}">
          <a href="#docs/${doc.id}" class="sidebar-link">
            <span class="sidebar-bullet"></span>
            <span class="sidebar-text">${doc.title}</span>
          </a>
        </li>`;
    });

    sidebarHtml += `</ul></div>`;
  });

  // Generate Articles HTML
  let articlesHtml = '';
  compiledDocs.forEach((doc) => {
    articlesHtml += `
      <article id="doc-${doc.id}" class="doc-content hidden" data-title="${doc.title}">
        <div class="content-header">
          <span class="content-category">${doc.category}</span>
          <h1 class="content-title">${doc.title}</h1>
        </div>
        <div class="prose">
          ${doc.html}
        </div>
      </article>`;
  });

  // Generate Search Index JSON
  const searchIndex = compiledDocs.map((doc) => {
    // Basic text content extraction (strip HTML tags)
    const textOnly = doc.rawContent
      .replace(/[#*`_[\]()-]/g, ' ')
      .replace(/\s+/g, ' ');

    return {
      id: doc.id,
      title: doc.title,
      category: doc.category,
      content: textOnly
    };
  });

  // Inject generated HTML into the template
  let finalHtml = templateContent
    .replace('<!-- SIDEBAR_NAVIGATION -->', sidebarHtml)
    .replace('<!-- ARTICLES_CONTENT -->', articlesHtml)
    .replace('/* SEARCH_INDEX_PLACEHOLDER */', JSON.stringify(searchIndex));

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write compiled output
  fs.writeFileSync(outputPath, finalHtml, 'utf8');
  console.log(`Documentation compiled successfully to: ${outputPath}`);
}

build();
