// src/ai/flows/interpret-natural-language-rule.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to interpret natural language input
 * and translate it into a structured rule format.
 *
 * - interpretNaturalLanguageRule - A function that handles the interpretation process.
 * - InterpretNaturalLanguageRuleInput - The input type for the interpretNaturalLanguageRule function.
 * - InterpretNaturalLanguageRuleOutput - The return type for the interpretNaturalLanguageRule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretNaturalLanguageRuleInputSchema = z.string().describe(
  'The natural language input representing a rule (e.g., \'If sales by John are greater than 10 units, then give him a 5% bonus\').'
);
export type InterpretNaturalLanguageRuleInput = z.infer<
  typeof InterpretNaturalLanguageRuleInputSchema
>;

const InterpretNaturalLanguageRuleOutputSchema = z.object({
  conditions: z
    .array(z.string())
    .describe('The conditions of the rule.'),
  operators: z
    .array(z.string())
    .describe('The operators used in the rule.'),
  values: z.array(z.string()).describe('The values used in the rule.'),
  actions: z
    .array(z.string())
    .describe('The actions to be performed when the rule is met.'),
});
export type InterpretNaturalLanguageRuleOutput = z.infer<
  typeof InterpretNaturalLanguageRuleOutputSchema
>;

export async function interpretNaturalLanguageRule(
  input: InterpretNaturalLanguageRuleInput
): Promise<InterpretNaturalLanguageRuleOutput> {
  return interpretNaturalLanguageRuleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretNaturalLanguageRulePrompt',
  input: {schema: InterpretNaturalLanguageRuleInputSchema},
  output: {schema: InterpretNaturalLanguageRuleOutputSchema},
  prompt: `You are an AI expert in converting natural language rules into a structured format.

  Given the following natural language rule:
  {{input}}

  Your task is to extract the conditions, operators, values, and actions from the rule and represent them in a structured JSON format.
  Conditions are the 'if' part of the rule
  Operators are what the conditions use to evaluate its values.
  Values are the values used in the conditions, on which operations take place.
  Actions are the 'then' part of the rule, and describe what happens if the rule's conditions are met.
  For example, if the input is "If sales by John are greater than 10 units, then give him a 5% bonus", the output should be:
  {
  "conditions": ["sales by John"],
  "operators": ["greater than"],
  "values": ["10 units"],
  "actions": ["give him a 5% bonus"]
  }
  `,
});

const interpretNaturalLanguageRuleFlow = ai.defineFlow(
  {
    name: 'interpretNaturalLanguageRuleFlow',
    inputSchema: InterpretNaturalLanguageRuleInputSchema,
    outputSchema: InterpretNaturalLanguageRuleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
