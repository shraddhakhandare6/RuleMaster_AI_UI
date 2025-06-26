"use server";

import { interpretNaturalLanguageRule, InterpretNaturalLanguageRuleOutput } from '@/ai/flows/interpret-natural-language-rule';
import { suggestRuleLogic } from '@/ai/flows/suggest-rule-logic';
import { z } from 'zod';

const parseRuleSchema = z.string().min(10, { message: 'Please provide a more detailed rule.' });

type ParseResult = {
  success: true;
  data: InterpretNaturalLanguageRuleOutput;
} | {
  success: false;
  error: string;
};

export async function parseRuleWithAI(naturalLanguage: string): Promise<ParseResult> {
  const validation = parseRuleSchema.safeParse(naturalLanguage);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  try {
    const result = await interpretNaturalLanguageRule(naturalLanguage);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error parsing rule with AI:', error);
    return { success: false, error: 'Failed to parse rule with AI. Please try again.' };
  }
}

export async function suggestLogicWithAI(ruleDescription: string) {
  try {
    const result = await suggestRuleLogic({ ruleDescription });
    return { success: true, data: result.suggestedLogic };
  } catch (error) {
    console.error('Error suggesting logic with AI:', error);
    return { success: false, error: 'Failed to suggest logic. Please try again.' };
  }
}
