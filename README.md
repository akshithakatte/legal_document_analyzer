# Legal Document Analyzer

An AI-powered legal document analysis tool that helps you understand and analyze legal documents with features like clause classification, risk assessment, and multilingual summarization.

## Features

- **Document Processing**: Extract and process text from PDF documents
- **Smart Clause Classification**: Automatically identify and categorize legal clauses
- **Risk Assessment**: Evaluate risk levels for different clauses and overall document
- **Multilingual Support**: Generate summaries in multiple languages
- **Text-to-Speech**: Listen to document summaries
- **Comprehensive Analysis**: Get detailed insights into legal documents

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **UI Components**: Radix UI, TailwindCSS
- **Document Processing**: `unpdf` for PDF text extraction
- **State Management**: React Context API
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akshithakatte/legal_document_analyzer.git
   cd legal_document_analyzer
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Create a `.env.local` file in the root directory with your environment variables:
   ```env
   NEXT_PUBLIC_APP_NAME="LegalAI Analyzer"
   # Add other environment variables as needed
   ```

### Running Locally

1. Start the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
├── components/             # Reusable UI components
├── lib/                    # Core business logic
│   ├── ml-classifier.ts    # Machine learning for clause classification
│   ├── risk-assessment-engine.ts # Risk assessment logic
│   ├── multilingual-summarizer.ts # Text summarization
│   └── pdf-processor.ts    # PDF text extraction
├── public/                 # Static files
└── styles/                 # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Built with [Next.js](https://nextjs.org/)
- UI Components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
