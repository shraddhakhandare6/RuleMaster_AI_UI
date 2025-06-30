
"use server";

import { interpretNaturalLanguageRule, InterpretNaturalLanguageRuleOutput } from '@/ai/flows/interpret-natural-language-rule';
import { suggestRuleLogic } from '@/ai/flows/suggest-rule-logic';
import { z } from 'zod';

const API_BASE_URL = 'http://localhost:3040';

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


export async function createRule(ruleData: any, naturalLanguageRule: string) {
  const requestBody = {
    tenantId: "test",
    userId: "saad",
    naturalLanguageRule,
    tag: "Customer",
    name: ruleData.name,
    description: ruleData.description,
    createdBy: "saad",
  };

  try {
    const response = await fetch(`${API_BASE_URL}/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || 'Failed to create rule.');
    }
    return { success: true, data: await response.json().catch(() => ({})) };
  } catch (error) {
    console.error('Error creating rule:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}

export async function updateRule(ruleId: string, ruleData: any, naturalLanguageRule: string) {
    const requestBody = {
        tenantId: "test",
        userId: "saad",
        naturalLanguageRule: naturalLanguageRule || `Update rule ${ruleData.name}`,
        rule:{
            name: ruleData.name,
            event: {
                type: "update_event",
                params: {
                    actions: ruleData.actions
                }
            },
            conditions: {
                all: ruleData.conditions.map(({ id, ...rest }: {id?: string}) => rest)
            }
        },
        tag: "Sales",
        name: ruleData.name,
        description: ruleData.description,
        createdBy:"saad"
    };

    try {
        const response = await fetch(`${API_BASE_URL}/rules/${ruleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(errorText || 'Failed to update rule.');
        }
        
        return { success: true, data: await response.json() };
    } catch (error) {
        console.error('Error updating rule:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
}
