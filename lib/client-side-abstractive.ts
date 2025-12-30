export interface AbstractiveSummaryResult {
  summary: string
  keyPoints: string[]
  confidence: number
  processingTime: number
  method: "rule-based" | "pattern-based" | "hybrid"
  originalTermsPreserved: string[]
  detailedSections: DetailedSection[]
}

export interface DetailedSection {
  type: "contract" | "payment" | "termination" | "liability" | "confidential" | "dispute" | "jurisdiction" | "general"
  title: string
  content: string
  originalQuotes: string[]
  importance: "high" | "medium" | "low"
}

export class ClientSideAbstractiveSummarizer {
  private legalPatterns: Map<string, string[]>
  private sentenceTemplates: string[]
  private legalVocabulary: Map<string, string[]>

  constructor() {
    this.legalPatterns = new Map()
    this.sentenceTemplates = []
    this.legalVocabulary = new Map()
    this.initializeLegalPatterns()
    this.initializeSentenceTemplates()
    this.initializeLegalVocabulary()
  }

  private initializeLegalPatterns() {
    this.legalPatterns.set("contract", [
      "This legally binding agreement establishes",
      "The parties hereby agree to",
      "This contract outlines the terms and conditions",
      "The agreement specifies the obligations"
    ])
    
    this.legalPatterns.set("payment", [
      "Financial compensation shall be provided",
      "Payment terms are structured as follows",
      "Monetary considerations include",
      "The financial arrangements specify"
    ])
    
    this.legalPatterns.set("termination", [
      "The agreement may be concluded under",
      "Termination provisions are outlined",
      "The contract may be ended when",
      "Conditions for conclusion include"
    ])
    
    this.legalPatterns.set("liability", [
      "Legal responsibilities are defined as",
      "Accountability provisions specify",
      "The parties shall be responsible for",
      "Obligations and liabilities include"
    ])
    
    this.legalPatterns.set("confidential", [
      "Privacy protections are implemented through",
      "Confidentiality measures ensure",
      "Sensitive information shall be safeguarded",
      "Data protection provisions include"
    ])
    
    this.legalPatterns.set("dispute", [
      "Conflict resolution mechanisms provide",
      "Disagreements shall be addressed through",
      "Controversy resolution options include",
      "The parties agree to resolve disputes via"
    ])
    
    this.legalPatterns.set("jurisdiction", [
      "Legal authority is established in",
      "Governing law provisions specify",
      "The agreement is subject to",
      "Legal jurisdiction falls under"
    ])
  }

  private initializeSentenceTemplates() {
    this.sentenceTemplates = [
      "This {document_type} establishes {key_terms} between the parties.",
      "The agreement outlines {obligations} and {protections}.",
      "Legal responsibilities include {specific_duties} and {consequences}.",
      "The contract specifies {conditions} for {outcomes}.",
      "Parties are bound by {requirements} and {limitations}.",
      "The document provides {safeguards} and {remedies}.",
      "Terms include {duration} and {termination_conditions}.",
      "The agreement ensures {compliance} with {standards}."
    ]
  }

  private initializeLegalVocabulary() {
    this.legalVocabulary.set("document_type", ["agreement", "contract", "understanding", "arrangement"])
    this.legalVocabulary.set("key_terms", ["essential provisions", "fundamental terms", "core requirements", "basic conditions"])
    this.legalVocabulary.set("obligations", ["duties", "responsibilities", "commitments", "requirements"])
    this.legalVocabulary.set("protections", ["safeguards", "security measures", "defenses", "provisions"])
    this.legalVocabulary.set("specific_duties", ["particular responsibilities", "defined obligations", "specified tasks", "clear requirements"])
    this.legalVocabulary.set("consequences", ["outcomes", "results", "implications", "effects"])
    this.legalVocabulary.set("conditions", ["requirements", "prerequisites", "stipulations", "provisions"])
    this.legalVocabulary.set("outcomes", ["results", "consequences", "endpoints", "resolutions"])
    this.legalVocabulary.set("requirements", ["obligations", "duties", "necessities", "conditions"])
    this.legalVocabulary.set("limitations", ["restrictions", "constraints", "boundaries", "limits"])
    this.legalVocabulary.set("safeguards", ["protections", "security measures", "defenses", "precautions"])
    this.legalVocabulary.set("remedies", ["solutions", "corrections", "fixes", "relief measures"])
    this.legalVocabulary.set("duration", ["time period", "length", "term", "period"])
    this.legalVocabulary.set("termination_conditions", ["ending requirements", "conclusion terms", "termination provisions", "end conditions"])
    this.legalVocabulary.set("compliance", ["adherence", "conformance", "obedience", "following"])
    this.legalVocabulary.set("standards", ["guidelines", "criteria", "benchmarks", "specifications"])
  }

  async generateAbstractiveSummary(text: string): Promise<AbstractiveSummaryResult> {
    const startTime = Date.now()

    try {
      console.log("[ClientSide] Starting detailed abstractive summarization...")

      // Step 1: Extract the actual original sentences from the document
      const originalSentences = this.extractOriginalSentences(text)
      
      // Step 2: Extract key themes and concepts
      const themes = this.extractLegalThemes(text)
      const keyEntities = this.extractKeyEntities(text)
      const relationships = this.identifyRelationships(text)
      
      // Step 3: Preserve important original terms
      const originalTerms = this.preserveOriginalTerms(text, themes)
      
      // Step 4: Create detailed sections
      const detailedSections = this.createDetailedSections(text, themes, relationships, originalTerms)

      // Step 5: Generate abstractive summary using ACTUAL document sentences
      const summary = this.createSummaryFromOriginalSentences(originalSentences, themes, originalTerms)

      // Step 6: Extract enhanced key points from original content
      const keyPoints = this.extractKeyPointsFromOriginal(originalSentences, themes, relationships)

      const processingTime = Date.now() - startTime

      return {
        summary: summary.trim(),
        keyPoints,
        confidence: this.calculateConfidence(themes, originalSentences),
        processingTime,
        method: "hybrid",
        originalTermsPreserved: originalTerms,
        detailedSections
      }

    } catch (error) {
      console.error("[ClientSide] Detailed abstractive summarization failed:", error)
      return this.fallbackSummary(text, Date.now() - startTime)
    }
  }

  private extractOriginalSentences(text: string): string[] {
    // Extract actual sentences from the document, preserving original wording
    const sentences = text.split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 15) // Only keep meaningful sentences
      .filter(s => !s.toLowerCase().startsWith('whereof') && !s.toLowerCase().startsWith('in witness')) // Remove formal endings
    
    return sentences
  }

  private createSummaryFromOriginalSentences(
    originalSentences: string[], 
    themes: Map<string, number>, 
    originalTerms: string[]
  ): string {
    if (originalSentences.length === 0) {
      return "The document contains legal provisions and agreements."
    }

    // Select more sentences for longer summary (at least 10 lines)
    const scoredSentences = originalSentences.map((sentence, index) => {
      const score = this.scoreSentenceImportance(sentence, themes, originalTerms)
      return { sentence, score, index }
    })

    // Sort by importance and take more sentences for longer summary
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(8, originalSentences.length)) // Increased from 4 to 8
      .sort((a, b) => a.index - b.index) // Maintain original order

    // Create comprehensive abstractive summary
    let summary = ""
    const usedTerms = new Set<string>()

    for (let i = 0; i < topSentences.length; i++) {
      const { sentence } = topSentences[i]
      let enhancedSentence = sentence

      // Add legal context enhancement
      const sentenceThemes = this.identifySentenceThemes(sentence, themes)
      if (sentenceThemes.length > 0) {
        const enhancement = this.getLegalEnhancement(sentenceThemes[0])
        if (!usedTerms.has(enhancement.toLowerCase())) {
          enhancedSentence += `, establishing ${enhancement}`
          usedTerms.add(enhancement.toLowerCase())
        }
      }

      // Add transition for subsequent sentences
      if (i === 0) {
        summary = enhancedSentence
      } else {
        const transitions = [
          "Furthermore,", "Additionally,", "In addition,", "Moreover,", 
          "The agreement also provides that", "Moreover, the contract specifies",
          "Additionally, the document states", "Furthermore, the terms include"
        ]
        const transition = transitions[Math.min(i - 1, transitions.length - 1)]
        summary += ` ${transition} ${enhancedSentence.charAt(0).toLowerCase() + enhancedSentence.slice(1)}`
      }

      // Track terms used in this sentence
      originalTerms.forEach(term => {
        if (sentence.toLowerCase().includes(term.toLowerCase())) {
          usedTerms.add(term.toLowerCase())
        }
      })
    }

    // Add remaining important sentences that weren't included yet
    const remainingSentences = originalSentences.filter((sentence, index) => 
      !topSentences.some(ts => ts.index === index) &&
      sentence.length > 20 &&
      !usedTerms.has(sentence.toLowerCase().substring(0, 20))
    ).slice(0, 4)

    remainingSentences.forEach((sentence, index) => {
      if (summary.length > 0) {
        const transitions = ["Additionally,", "Moreover,", "The document further states", "The terms also specify"]
        const transition = transitions[Math.min(index, transitions.length - 1)]
        summary += ` ${transition} ${sentence.charAt(0).toLowerCase() + sentence.slice(1)}`
      } else {
        summary = sentence
      }
    })

    // Add any remaining important original terms that weren't included
    const unusedImportantTerms = originalTerms.filter(term => 
      !usedTerms.has(term.toLowerCase()) &&
      this.isImportantTerm(term)
    )

    if (unusedImportantTerms.length > 0 && summary.length < 1500) {
      const termsToAdd = unusedImportantTerms.slice(0, 5)
      summary += ` The agreement specifically addresses ${termsToAdd.join(', ')}.`
    }

    // Ensure minimum length of 10 lines by adding more content if needed
    const lines = summary.split('. ').length
    if (lines < 10) {
      const additionalContent = this.generateAdditionalContent(themes, originalTerms, usedTerms)
      if (additionalContent) {
        summary += ` ${additionalContent}`
      }
    }

    return summary
  }

  private generateAdditionalContent(
    themes: Map<string, number>, 
    originalTerms: string[],
    usedTerms: Set<string>
  ): string {
    const additionalSentences: string[] = []

    // Generate additional sentences based on themes not yet covered
    const coveredThemes = this.identifyCoveredThemesFromSummary(themes, usedTerms)
    const uncoveredThemes = Array.from(themes.keys()).filter(theme => !coveredThemes.has(theme))

    uncoveredThemes.slice(0, 3).forEach(theme => {
      const sentence = this.createThemeSpecificSentence(theme, originalTerms, usedTerms)
      if (sentence) {
        additionalSentences.push(sentence)
      }
    })

    // Add general legal provisions if needed
    if (additionalSentences.length === 0) {
      additionalSentences.push("The agreement establishes comprehensive legal frameworks and protections for all parties involved.")
      additionalSentences.push("All provisions are legally binding and enforceable according to applicable laws and regulations.")
    }

    return additionalSentences.join(' ')
  }

  private identifyCoveredThemesFromSummary(themes: Map<string, number>, usedTerms: Set<string>): Set<string> {
    const covered = new Set<string>()
    
    themes.forEach((count, theme) => {
      if (usedTerms.has(theme.toLowerCase())) {
        covered.add(theme)
      }
    })

    return covered
  }

  private scoreSentenceImportance(
    sentence: string, 
    themes: Map<string, number>, 
    originalTerms: string[]
  ): number {
    let score = 0

    // Score based on legal themes
    themes.forEach((count, theme) => {
      if (sentence.toLowerCase().includes(theme.toLowerCase())) {
        score += count * 2 // Weight themes higher
      }
    })

    // Score based on original terms
    originalTerms.forEach(term => {
      if (sentence.toLowerCase().includes(term.toLowerCase())) {
        score += 3 // Weight original terms highest
      }
    })

    // Score based on sentence length (longer sentences often contain more info)
    score += Math.min(sentence.length / 20, 5)

    // Score based on legal keywords
    const legalKeywords = ['shall', 'must', 'agreement', 'contract', 'party', 'obligation', 'liability', 'termination']
    legalKeywords.forEach(keyword => {
      if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
        score += 2
      }
    })

    return score
  }

  private identifySentenceThemes(sentence: string, themes: Map<string, number>): string[] {
    const sentenceThemes: string[] = []
    
    themes.forEach((count, theme) => {
      if (sentence.toLowerCase().includes(theme.toLowerCase())) {
        sentenceThemes.push(theme)
      }
    })

    return sentenceThemes
  }

  private getLegalEnhancement(theme: string): string {
    const enhancements: { [key: string]: string } = {
      "contract": "binding legal obligations",
      "payment": "financial compensation arrangements", 
      "termination": "ending provisions",
      "liability": "legal responsibilities",
      "confidential": "privacy protections",
      "dispute": "conflict resolution mechanisms",
      "jurisdiction": "governing law provisions"
    }
    
    return enhancements[theme] || "legal provisions"
  }

  private isImportantTerm(term: string): boolean {
    // Consider terms with dates, amounts, percentages, or legal entities as important
    return /\d/.test(term) || // Contains numbers
           term.includes('$') || // Contains money
           term.includes('%') || // Contains percentage
           term.includes('Pvt') || term.includes('Ltd') || term.includes('Inc') || // Company suffixes
           term.length > 10 // Longer terms are likely more important
  }

  private extractKeyPointsFromOriginal(
    originalSentences: string[], 
    themes: Map<string, number>, 
    relationships: Map<string, string[]>
  ): string[] {
    const keyPoints: string[] = []

    // Extract key points from the most important original sentences
    const scoredSentences = originalSentences.map((sentence, index) => ({
      sentence,
      score: this.scoreSentenceImportance(sentence, themes, [])
    }))

    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)

    // Create key points from these sentences
    topSentences.forEach(({ sentence }, index) => {
      if (index < 3) {
        // Use the original sentence as a key point for top 3
        keyPoints.push(sentence)
      } else {
        // Create a shorter version for others
        const words = sentence.split(' ')
        let shortened = words.slice(0, 15).join(' ')
        if (shortened.length < sentence.length) {
          shortened += '...'
        }
        keyPoints.push(shortened)
      }
    })

    // Add key points from relationships
    relationships.forEach((rels, type) => {
      if (rels.length > 0 && keyPoints.length < 8) {
        const relationship = rels[0]
        if (relationship.length < 100) {
          keyPoints.push(`The document specifies ${type} requirements: ${relationship}`)
        }
      }
    })

    // Ensure we have at least 5 key points
    while (keyPoints.length < 5) {
      keyPoints.push("The agreement establishes important legal frameworks and protections")
    }

    return keyPoints.slice(0, 8)
  }

  private preserveOriginalTerms(text: string, themes: Map<string, number>): string[] {
    const originalTerms: string[] = []
    
    // Extract important legal terms from the original text
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
    
    // Preserve specific legal terminology
    const legalTerms = [
      "hereby agrees", "shall", "must", "may not", "liable for", "indemnify",
      "confidential information", "proprietary information", "trade secrets",
      "force majeure", "governing law", "jurisdiction", "arbitration",
      "termination", "breach", "default", "cure period", "notice period",
      "compensation", "damages", "liquidated damages", "penalty"
    ]
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase()
      
      // Check for legal terms
      legalTerms.forEach(term => {
        if (lowerSentence.includes(term.toLowerCase())) {
          // Extract the original phrase containing the term
          const words = sentence.split(/\s+/)
          const termIndex = words.findIndex(word => 
            word.toLowerCase().includes(term.split(' ')[0])
          )
          
          if (termIndex !== -1) {
            // Get context around the term (3 words before and after)
            const start = Math.max(0, termIndex - 3)
            const end = Math.min(words.length, termIndex + 4)
            const contextPhrase = words.slice(start, end).join(' ')
            
            if (!originalTerms.includes(contextPhrase)) {
              originalTerms.push(contextPhrase)
            }
          }
        }
      })
    })
    
    // Preserve dates, amounts, and specific numbers
    const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{1,2}-\d{1,2}-\d{4}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi
    const dates = text.match(dateRegex) || []
    originalTerms.push(...dates)
    
    const amountRegex = /\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:dollars?|USD|rupees?|Rs|euros?|EUR)/gi
    const amounts = text.match(amountRegex) || []
    originalTerms.push(...amounts)
    
    const percentRegex = /\b\d+\.?\d*%\b|\b\d+\.?\d*\s*percent\b/gi
    const percentages = text.match(percentRegex) || []
    originalTerms.push(...percentages)
    
    const timeRegex = /\b\d+\s*(?:days?|weeks?|months?|years?)\b/gi
    const periods = text.match(timeRegex) || []
    originalTerms.push(...periods)
    
    // Preserve party names and entities
    const partyRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Pvt\.?|Ltd\.?|LLC|Inc\.?|Corp\.?))?\b/g
    const parties = text.match(partyRegex) || []
    originalTerms.push(...parties.slice(0, 10)) // Limit to first 10 entities
    
    return [...new Set(originalTerms)].slice(0, 20) // Return top 20 unique terms
  }

  private createDetailedSections(
    text: string, 
    themes: Map<string, number>, 
    relationships: Map<string, string[]>,
    originalTerms: string[]
  ): DetailedSection[] {
    const sections: DetailedSection[] = []
    
    // Create sections for each major theme
    themes.forEach((count, theme) => {
      if (count > 0) {
        const section = this.createThemeSection(text, theme, originalTerms)
        if (section) {
          sections.push(section)
        }
      }
    })
    
    // Add general section if no specific themes found
    if (sections.length === 0) {
      sections.push(this.createGeneralSection(text, originalTerms))
    }
    
    return sections.sort((a, b) => {
      const importanceOrder = { high: 3, medium: 2, low: 1 }
      return importanceOrder[b.importance] - importanceOrder[a.importance]
    })
  }

  private createThemeSection(text: string, theme: string, originalTerms: string[]): DetailedSection | null {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 15)
    const themeSentences = sentences.filter(sentence => 
      sentence.toLowerCase().includes(theme.toLowerCase()) ||
      this.legalPatterns.get(theme)?.some(pattern => 
        sentence.toLowerCase().includes(pattern.toLowerCase())
      )
    )
    
    if (themeSentences.length === 0) return null
    
    const relevantTerms = originalTerms.filter(term => 
      themeSentences.some(sentence => sentence.toLowerCase().includes(term.toLowerCase()))
    )
    
    const importance = themeSentences.length > 2 ? "high" : 
                     themeSentences.length > 1 ? "medium" : "low"
    
    return {
      type: theme as any,
      title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Provisions`,
      content: this.generateSectionSummary(themeSentences, relevantTerms),
      originalQuotes: themeSentences.slice(0, 3).map(s => s.trim()),
      importance
    }
  }

  private createGeneralSection(text: string, originalTerms: string[]): DetailedSection {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 15)
    const keySentences = sentences.slice(0, 5)
    
    return {
      type: "general",
      title: "General Provisions",
      content: this.generateSectionSummary(keySentences, originalTerms),
      originalQuotes: keySentences.slice(0, 3).map(s => s.trim()),
      importance: "medium"
    }
  }

  private generateSectionSummary(sentences: string[], relevantTerms: string[]): string {
    let summary = sentences[0]
    
    // Add relevant original terms to the summary
    relevantTerms.slice(0, 3).forEach(term => {
      if (!summary.toLowerCase().includes(term.toLowerCase())) {
        summary += ` The document specifies ${term}.`
      }
    })
    
    return summary
  }

  private generateAbstractiveSentencesWithTerms(
    themes: Map<string, number>, 
    entities: string[], 
    relationships: Map<string, string[]>,
    originalTerms: string[]
  ): string[] {
    const sentences: string[] = []
    const usedTerms = new Set<string>()

    // Generate sentences based on actual document content
    const documentSentences = this.extractImportantSentences(originalTerms, themes)
    
    // Create abstractive versions of important sentences
    documentSentences.slice(0, 3).forEach((originalSentence, index) => {
      const abstractiveVersion = this.createAbstractiveVersion(originalSentence, themes, entities, usedTerms)
      if (abstractiveVersion && abstractiveVersion.length > 20) {
        sentences.push(abstractiveVersion + ".")
      }
    })

    // Add sentences for key themes that weren't covered
    const coveredThemes = this.identifyCoveredThemes(sentences, themes)
    const uncoveredThemes = Array.from(themes.keys()).filter(theme => !coveredThemes.has(theme))
    
    uncoveredThemes.slice(0, 2).forEach(theme => {
      const themeSentence = this.createThemeSpecificSentence(theme, originalTerms, usedTerms)
      if (themeSentence) {
        sentences.push(themeSentence + ".")
      }
    })

    return sentences
  }

  private extractImportantSentences(originalTerms: string[], themes: Map<string, number>): string[] {
    // Reconstruct important sentences from original terms and context
    const sentences: string[] = []
    
    // Group related terms to form coherent sentences
    const termGroups = this.groupRelatedTerms(originalTerms)
    
    termGroups.forEach(group => {
      if (group.length >= 2) {
        // Create a sentence from related terms
        const sentence = this.createSentenceFromTerms(group)
        if (sentence && sentence.length > 15) {
          sentences.push(sentence)
        }
      }
    })

    return sentences
  }

  private groupRelatedTerms(originalTerms: string[]): string[][] {
    const groups: string[][] = []
    const usedTerms = new Set<string>()
    
    // Group terms by proximity in original text (simplified approach)
    originalTerms.forEach((term, index) => {
      if (!usedTerms.has(term)) {
        const group = [term]
        usedTerms.add(term)
        
        // Look for related terms nearby
        for (let i = index + 1; i < Math.min(index + 4, originalTerms.length); i++) {
          const nextTerm = originalTerms[i]
          if (!usedTerms.has(nextTerm) && this.areTermsRelated(term, nextTerm)) {
            group.push(nextTerm)
            usedTerms.add(nextTerm)
          }
        }
        
        if (group.length >= 2) {
          groups.push(group)
        }
      }
    })
    
    return groups
  }

  private areTermsRelated(term1: string, term2: string): boolean {
    // Check if terms are related by legal context
    const legalContexts = [
      ['payment', 'salary', 'compensation', 'amount', '$'],
      ['termination', 'end', 'conclude', 'notice', 'period'],
      ['confidential', 'proprietary', 'information', 'secret', 'privacy'],
      ['contract', 'agreement', 'terms', 'conditions', 'provisions'],
      ['party', 'parties', 'company', 'employee', 'employer'],
      ['date', 'time', 'period', 'duration', 'when']
    ]
    
    return legalContexts.some(context => 
      context.some(word => term1.toLowerCase().includes(word.toLowerCase())) &&
      context.some(word => term2.toLowerCase().includes(word.toLowerCase()))
    )
  }

  private createSentenceFromTerms(terms: string[]): string {
    // Create a coherent sentence from related terms
    if (terms.length === 2) {
      return `The document specifies ${terms[0]} and ${terms[1]}`
    } else if (terms.length === 3) {
      return `The agreement addresses ${terms[0]}, ${terms[1]}, and ${terms[2]}`
    } else {
      const lastTerms = terms.slice(-2).join(', and ')
      const firstTerms = terms.slice(0, -2).join(', ')
      return `The document covers ${firstTerms}, as well as ${lastTerms}`
    }
  }

  private createAbstractiveVersion(
    originalSentence: string, 
    themes: Map<string, number>, 
    entities: string[],
    usedTerms: Set<string>
  ): string {
    // Create an abstractive version that preserves key information
    let abstractive = originalSentence
    
    // Enhance with legal context while avoiding repetition
    const relevantThemes = Array.from(themes.keys()).filter(theme => 
      originalSentence.toLowerCase().includes(theme.toLowerCase())
    )
    
    if (relevantThemes.length > 0) {
      const theme = relevantThemes[0]
      const enhancements = this.getThemeEnhancements(theme)
      const enhancement = enhancements.find(e => !usedTerms.has(e.toLowerCase()))
      
      if (enhancement) {
        abstractive += `, establishing ${enhancement}`
        usedTerms.add(enhancement.toLowerCase())
      }
    }
    
    // Add relevant entities if not already mentioned
    const relevantEntities = entities.filter(entity => 
      !abstractive.toLowerCase().includes(entity.toLowerCase()) &&
      !usedTerms.has(entity.toLowerCase())
    )
    
    if (relevantEntities.length > 0) {
      abstractive += ` with ${relevantEntities[0]}`
      usedTerms.add(relevantEntities[0].toLowerCase())
    }
    
    return abstractive
  }

  private getThemeEnhancements(theme: string): string[] {
    const enhancements: { [key: string]: string[] } = {
      "contract": ["binding legal obligations", "formal agreement terms", "contractual commitments"],
      "payment": ["financial compensation arrangements", "monetary consideration terms", "payment structures"],
      "termination": ["ending provisions", "conclusion conditions", "termination requirements"],
      "liability": ["legal responsibilities", "accountability measures", "liability frameworks"],
      "confidential": ["privacy protections", "confidentiality safeguards", "information security measures"],
      "dispute": ["conflict resolution mechanisms", "disagreement procedures", "controversy resolution"],
      "jurisdiction": ["legal authority framework", "governing law provisions", "jurisdictional requirements"]
    }
    
    return enhancements[theme] || ["legal provisions"]
  }

  private identifyCoveredThemes(sentences: string[], themes: Map<string, number>): Set<string> {
    const covered = new Set<string>()
    
    sentences.forEach(sentence => {
      themes.forEach((count, theme) => {
        if (sentence.toLowerCase().includes(theme.toLowerCase())) {
          covered.add(theme)
        }
      })
    })
    
    return covered
  }

  private createThemeSpecificSentence(
    theme: string, 
    originalTerms: string[], 
    usedTerms: Set<string>
  ): string {
    // Find relevant original terms for this theme
    const relevantTerms = originalTerms.filter(term => 
      term.toLowerCase().includes(theme.toLowerCase()) ||
      theme.toLowerCase().includes(term.toLowerCase()) ||
      this.areTermsRelated(theme, term)
    ).filter(term => !usedTerms.has(term.toLowerCase()))
    
    if (relevantTerms.length === 0) {
      return `The agreement includes important ${theme} provisions`
    }
    
    const patterns = this.legalPatterns.get(theme) || []
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)]
    
    let sentence = selectedPattern
    
    // Add relevant terms naturally
    if (relevantTerms.length === 1) {
      sentence += ` involving ${relevantTerms[0]}`
    } else if (relevantTerms.length === 2) {
      sentence += ` covering ${relevantTerms[0]} and ${relevantTerms[1]}`
    } else {
      sentence += ` addressing ${relevantTerms.slice(0, 2).join(', ')} and other related aspects`
    }
    
    // Mark terms as used
    relevantTerms.forEach(term => usedTerms.add(term.toLowerCase()))
    
    return sentence
  }

  private abstractRelationshipWithTerms(
    relationship: string, 
    type: string, 
    originalTerms: string[]
  ): string {
    const lowerRelation = relationship.toLowerCase()
    
    // Find relevant original terms
    const relevantTerms = originalTerms.filter(term => 
      lowerRelation.includes(term.toLowerCase()) ||
      term.toLowerCase().includes(type.toLowerCase())
    )

    switch (type) {
      case "conditional":
        let conditionalText = "The agreement includes conditional provisions"
        if (relevantTerms.length > 0) {
          conditionalText += ` that specify requirements for certain outcomes, particularly ${relevantTerms[0]}`
        }
        return conditionalText + "."
      
      case "obligation":
        let obligationText = "The parties have clearly defined obligations"
        if (relevantTerms.length > 0) {
          obligationText += `, including ${relevantTerms[0]}`
        }
        return obligationText + " that must be fulfilled according to the specified terms."
      
      case "prohibition":
        let prohibitionText = "The agreement includes specific restrictions"
        if (relevantTerms.length > 0) {
          prohibitionText += ` regarding ${relevantTerms[0]}`
        }
        return prohibitionText + " that the parties must adhere to throughout the relationship."
      
      case "permission":
        let permissionText = "The document grants certain permissions"
        if (relevantTerms.length > 0) {
          permissionText += ` related to ${relevantTerms[0]}`
        }
        return permissionText + " under specified circumstances."
      
      default:
        return "The agreement establishes important legal relationships between the involved parties."
    }
  }

  private fillTemplateWithTerms(
    template: string, 
    themes: Map<string, number>, 
    entities: string[],
    originalTerms: string[]
  ): string {
    let filled = template

    // Replace template variables with original terms when possible
    const themeKeys = Array.from(themes.keys())
    const entitySample = entities.slice(0, 2)
    const termSample = originalTerms.slice(0, 2)

    filled = filled.replace(/{document_type}/g, "agreement")
    filled = filled.replace(/{key_terms}/g, termSample[0] || "essential provisions")
    filled = filled.replace(/{obligations}/g, termSample[1] || "binding duties")
    filled = filled.replace(/{protections}/g, "legal safeguards")
    filled = filled.replace(/{specific_duties}/g, "clearly defined responsibilities")
    filled = filled.replace(/{consequences}/g, entitySample[0] || "specified outcomes")
    filled = filled.replace(/{conditions}/g, entitySample[1] || "necessary requirements")
    filled = filled.replace(/{outcomes}/g, "intended results")
    filled = filled.replace(/{requirements}/g, "mandatory obligations")
    filled = filled.replace(/{limitations}/g, "specified restrictions")
    filled = filled.replace(/{safeguards}/g, "protective measures")
    filled = filled.replace(/{remedies}/g, "available solutions")
    filled = filled.replace(/{duration}/g, "specified time period")
    filled = filled.replace(/{termination_conditions}/g, "ending provisions")
    filled = filled.replace(/{compliance}/g, "adherence to requirements")
    filled = filled.replace(/{standards}/g, "specified guidelines")

    return filled
  }

  private createComprehensiveSummary(sentences: string[], originalTerms: string[]): string {
    // Remove duplicates and similar sentences
    const uniqueSentences = sentences.filter((sentence, index, self) => 
      index === self.findIndex((s) => s.toLowerCase() === sentence.toLowerCase())
    )

    // Sort by importance (longer sentences often contain more information)
    uniqueSentences.sort((a, b) => b.length - a.length)

    // Take top sentences and create comprehensive flow
    const topSentences = uniqueSentences.slice(0, 4)
    
    let summary = ""
    
    // Build summary progressively, avoiding repetition
    const usedTerms = new Set<string>()
    
    for (let i = 0; i < topSentences.length; i++) {
      const sentence = topSentences[i]
      
      if (i === 0) {
        summary = sentence
      } else {
        // Add transition only if needed
        const transitions = ["Furthermore,", "Additionally,", "In addition,", "Moreover,"]
        const transition = transitions[Math.min(i - 1, transitions.length - 1)]
        summary += ` ${transition} ${sentence.charAt(0).toLowerCase() + sentence.slice(1)}`
      }
      
      // Track used terms to avoid repetition
      originalTerms.forEach(term => {
        if (sentence.toLowerCase().includes(term.toLowerCase())) {
          usedTerms.add(term.toLowerCase())
        }
      })
    }
    
    // Add important original terms that weren't included yet
    const unusedTerms = originalTerms.filter(term => 
      !usedTerms.has(term.toLowerCase()) && 
      !summary.toLowerCase().includes(term.toLowerCase())
    )
    
    if (unusedTerms.length > 0 && summary.length < 800) {
      // Add remaining key terms naturally
      const additionalTerms = unusedTerms.slice(0, 3)
      const termString = additionalTerms.join(", ")
      
      // Find a natural place to insert the terms
      if (summary.includes(".")) {
        const lastSentenceIndex = summary.lastIndexOf(".")
        if (lastSentenceIndex > summary.length - 100) {
          summary = summary.substring(0, lastSentenceIndex) + 
                   `, with specific reference to ${termString}.` + 
                   summary.substring(lastSentenceIndex + 1)
        } else {
          summary += ` The document specifically addresses ${termString}.`
        }
      } else {
        summary += ` The document specifically addresses ${termString}.`
      }
    }

    return summary
  }

  private extractDetailedKeyPoints(
    themes: Map<string, number>, 
    relationships: Map<string, string[]>,
    originalTerms: string[]
  ): string[] {
    const keyPoints: string[] = []

    // Extract key points from themes with original terms
    themes.forEach((count, theme) => {
      const patterns = this.legalPatterns.get(theme) || []
      if (patterns.length > 0 && count > 1) {
        const themeTerms = originalTerms.filter(term => 
          term.toLowerCase().includes(theme.toLowerCase())
        )
        let keyPoint = `${theme.charAt(0).toUpperCase() + theme.slice(1)} provisions are clearly defined`
        if (themeTerms.length > 0) {
          keyPoint += `, including ${themeTerms[0]}`
        }
        keyPoints.push(keyPoint)
      }
    })

    // Extract key points from relationships with original terms
    relationships.forEach((rels, type) => {
      if (rels.length > 0) {
        const relevantTerms = originalTerms.filter(term => 
          rels[0].toLowerCase().includes(term.toLowerCase())
        )
        let keyPoint = `The document specifies ${type} requirements`
        if (relevantTerms.length > 0) {
          keyPoint += ` related to ${relevantTerms[0]}`
        }
        keyPoints.push(keyPoint)
      }
    })

    // Add key original terms as points
    originalTerms.slice(0, 3).forEach(term => {
      keyPoints.push(`The agreement specifically addresses ${term}`)
    })

    // Ensure we have at least 5 key points
    while (keyPoints.length < 5) {
      keyPoints.push("The agreement establishes important legal frameworks and protections")
    }

    return keyPoints.slice(0, 8) // Return top 8 key points
  }
    private extractLegalThemes(text: string): Map<string, number> {
    const themes = new Map<string, number>()
    const lowerText = text.toLowerCase()

    // Count theme occurrences
    this.legalPatterns.forEach((patterns, theme) => {
      let count = 0
      patterns.forEach(pattern => {
        const regex = new RegExp(pattern.toLowerCase().replace(/\s+/g, '\\s+'), 'gi')
        const matches = lowerText.match(regex)
        if (matches) {
          count += matches.length
        }
      })
      
      // Also count direct theme mentions
      const themeRegex = new RegExp(theme.toLowerCase(), 'gi')
      const themeMatches = lowerText.match(themeRegex)
      if (themeMatches) {
        count += themeMatches.length * 2 // Weight direct mentions higher
      }

      if (count > 0) {
        themes.set(theme, count)
      }
    })

    return themes
  }

  private extractKeyEntities(text: string): string[] {
    const entities: string[] = []
    
    // Extract dates
    const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{1,2}-\d{1,2}-\d{4}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi
    const dates = text.match(dateRegex) || []
    entities.push(...dates)

    // Extract monetary amounts
    const moneyRegex = /\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:dollars?|USD|rupees?|Rs|euros?|EUR)/gi
    const amounts = text.match(moneyRegex) || []
    entities.push(...amounts)

    // Extract percentages
    const percentRegex = /\b\d+\.?\d*%\b|\b\d+\.?\d*\s*percent\b/gi
    const percentages = text.match(percentRegex) || []
    entities.push(...percentages)

    // Extract time periods
    const timeRegex = /\b\d+\s*(?:days?|weeks?|months?|years?)\b/gi
    const periods = text.match(timeRegex) || []
    entities.push(...periods)

    return [...new Set(entities)] // Remove duplicates
  }

  private identifyRelationships(text: string): Map<string, string[]> {
    const relationships = new Map<string, string[]>()
    
    // Look for conditional relationships
    const conditionalRegex = /\b(if|when|provided that|subject to|in the event that|should|unless)\b[^.]*\./gi
    const conditionals = text.match(conditionalRegex) || []
    if (conditionals.length > 0) {
      relationships.set("conditional", conditionals.map(c => c.trim()))
    }

    // Look for obligation relationships
    const obligationRegex = /\b(shall|must|will|required to|obligated to|responsible for)\b[^.]*\./gi
    const obligations = text.match(obligationRegex) || []
    if (obligations.length > 0) {
      relationships.set("obligation", obligations.map(o => o.trim()))
    }

    // Look for prohibition relationships
    const prohibitionRegex = /\b(shall not|must not|may not|prohibited|restricted|forbidden)\b[^.]*\./gi
    const prohibitions = text.match(prohibitionRegex) || []
    if (prohibitions.length > 0) {
      relationships.set("prohibition", prohibitions.map(p => p.trim()))
    }

    // Look for permission relationships
    const permissionRegex = /\b(may|can|permitted to|allowed to|has the right to)\b[^.]*\./gi
    const permissions = text.match(permissionRegex) || []
    if (permissions.length > 0) {
      relationships.set("permission", permissions.map(p => p.trim()))
    }

    return relationships
  }

  private generateAbstractiveSentences(
    themes: Map<string, number>, 
    entities: string[], 
    relationships: Map<string, string[]>
  ): string[] {
    const sentences: string[] = []

    // Generate sentences based on top themes
    const sortedThemes = Array.from(themes.entries()).sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 3)

    sortedThemes.forEach(([theme, count]) => {
      const patterns = this.legalPatterns.get(theme as string) || []
      const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)]
      
      // Enhance pattern with entities
      let enhancedSentence = selectedPattern
      
      // Add relevant entities
      entities.forEach(entity => {
        if (Math.random() > 0.7) { // 30% chance to include each entity
          enhancedSentence += ` including ${entity}`
        }
      })

      sentences.push(enhancedSentence + ".")
    })

    // Generate sentences based on relationships
    relationships.forEach((rels, type) => {
      if (rels.length > 0 && sentences.length < 5) {
        const relationship = rels[0] // Take the first relationship of each type
        const abstracted = this.abstractRelationship(relationship, type as string)
        sentences.push(abstracted)
      }
    })

    // Fill with template-based sentences if needed
    while (sentences.length < 3) {
      const template = this.sentenceTemplates[Math.floor(Math.random() * this.sentenceTemplates.length)]
      const filled = this.fillTemplate(template, themes, entities)
      sentences.push(filled)
    }

    return sentences
  }

  private abstractRelationship(relationship: string, type: string): string {
    const lowerRelation = relationship.toLowerCase()

    switch (type) {
      case "conditional":
        if (lowerRelation.includes("if")) {
          return "The agreement includes conditional provisions that specify requirements for certain outcomes."
        }
        return "The document outlines specific conditions that must be met for various provisions to take effect."
      
      case "obligation":
        return "The parties have clearly defined obligations and responsibilities that must be fulfilled according to the specified terms."
      
      case "prohibition":
        return "The agreement includes specific restrictions and prohibitions that the parties must adhere to throughout the relationship."
      
      case "permission":
        return "The document grants certain permissions and rights to the parties under specified circumstances."
      
      default:
        return "The agreement establishes important legal relationships between the involved parties."
    }
  }

  private fillTemplate(
    template: string, 
    themes: Map<string, number>, 
    entities: string[]
  ): string {
    let filled = template

    // Replace template variables
    const themeKeys = Array.from(themes.keys())
    const entitySample = entities.slice(0, 2)

    filled = filled.replace(/{document_type}/g, "agreement")
    filled = filled.replace(/{key_terms}/g, "essential provisions and requirements")
    filled = filled.replace(/{obligations}/g, "binding duties and responsibilities")
    filled = filled.replace(/{protections}/g, "legal safeguards and protections")
    filled = filled.replace(/{specific_duties}/g, "clearly defined responsibilities")
    filled = filled.replace(/{consequences}/g, "specified outcomes and results")
    filled = filled.replace(/{conditions}/g, "necessary requirements and stipulations")
    filled = filled.replace(/{outcomes}/g, "intended results and consequences")
    filled = filled.replace(/{requirements}/g, "mandatory obligations")
    filled = filled.replace(/{limitations}/g, "specified restrictions")
    filled = filled.replace(/{safeguards}/g, "protective measures")
    filled = filled.replace(/{remedies}/g, "available solutions")
    filled = filled.replace(/{duration}/g, "specified time period")
    filled = filled.replace(/{termination_conditions}/g, "ending provisions")
    filled = filled.replace(/{compliance}/g, "adherence to requirements")
    filled = filled.replace(/{standards}/g, "specified guidelines")

    return filled
  }

  private createCoherentSummary(sentences: string[]): string {
    // Remove duplicates and similar sentences
    const uniqueSentences = sentences.filter((sentence, index, self) => 
      index === self.findIndex((s) => s.toLowerCase() === sentence.toLowerCase())
    )

    // Sort by importance (longer sentences often contain more information)
    uniqueSentences.sort((a, b) => b.length - a.length)

    // Take top 3-4 sentences and create coherent flow
    const topSentences = uniqueSentences.slice(0, 4)
    
    // Add transition words for better flow
    const transitions = ["Furthermore,", "Additionally,", "In addition,", "Moreover,"]
    
    let summary = topSentences[0] || ""
    
    for (let i = 1; i < topSentences.length; i++) {
      const transition = transitions[i - 1] || ""
      summary += ` ${transition} ${topSentences[i].charAt(0).toLowerCase() + topSentences[i].slice(1)}`
    }

    return summary
  }

  private extractKeyPoints(
    themes: Map<string, number>, 
    relationships: Map<string, string[]>
  ): string[] {
    const keyPoints: string[] = []

    // Extract key points from themes
    themes.forEach((count, theme) => {
      const patterns = this.legalPatterns.get(theme as string) || []
      if (patterns.length > 0 && (count as number) > 1) {
        keyPoints.push(`${(theme as string).charAt(0).toUpperCase() + (theme as string).slice(1)} provisions are clearly defined in the agreement`)
      }
    })

    // Extract key points from relationships
    relationships.forEach((rels, type) => {
      if (rels.length > 0) {
        keyPoints.push(`The document specifies ${type} requirements and conditions`)
      }
    })

    // Ensure we have at least 3 key points
    while (keyPoints.length < 3) {
      keyPoints.push("The agreement establishes important legal frameworks and protections")
    }

    return keyPoints.slice(0, 5) // Return top 5 key points
  }

  private calculateConfidence(
    themes: Map<string, number>, 
    sentences: string[]
  ): number {
    let confidence = 0.5 // Base confidence

    // Boost confidence based on theme detection
    if (themes.size > 0) {
      confidence += 0.1
    }
    if (themes.size > 2) {
      confidence += 0.1
    }

    // Boost confidence based on sentence quality
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length
    if (avgSentenceLength > 50) {
      confidence += 0.1
    }
    if (avgSentenceLength > 80) {
      confidence += 0.1
    }

    // Boost confidence based on variety
    const uniqueWords = new Set(sentences.join(' ').toLowerCase().split(/\s+/)).size
    if (uniqueWords > 30) {
      confidence += 0.1
    }

    return Math.min(confidence, 0.85) // Cap at 0.85 for client-side
  }

  private fallbackSummary(text: string, startTime: number): AbstractiveSummaryResult {
    console.log("[ClientSide] Using fallback summarization")
    
    // Simple extractive fallback with minimal abstraction
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
    const summary = sentences.slice(0, 3).join(". ") + "."
    
    return {
      summary,
      keyPoints: sentences.slice(0, 3).map(s => s.trim()),
      confidence: 0.6,
      processingTime: Date.now() - startTime,
      method: "rule-based",
      originalTermsPreserved: [],
      detailedSections: []
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const testText = "This contract establishes payment terms and confidentiality obligations between the parties."
      const result = await this.generateAbstractiveSummary(testText)
      return result.summary.length > 0 && result.confidence > 0.5
    } catch (error) {
      console.error("[ClientSide] Connection test failed:", error)
      return false
    }
  }
}
