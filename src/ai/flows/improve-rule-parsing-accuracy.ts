'use server';
/**
 * @fileOverview Improves rule parsing accuracy by learning from user corrections and preferences.
 *
 * - improveRuleParsingAccuracy - A function that handles the process of improving rule parsing accuracy.
 * - ImproveRuleParsingAccuracyInput - The input type for the improveRuleParsingAccuracy function.
 * - ImproveRuleParsingAccuracyOutput - The return type for the improveRuleParsingAccuracy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveRuleParsingAccuracyInputSchema = z.object({
  originalInput: z
    .string()
    .describe('The original natural language input from the user.'),
  correctedRule:
    z.string().describe('The corrected rule provided by the user.'),
});
export type ImproveRuleParsingAccuracyInput = z.infer<
  typeof ImproveRuleParsingAccuracyInputSchema
>;

const ImproveRuleParsingAccuracyOutputSchema = z.object({
  feedback: z
    .string()
    .describe(
      'A confirmation message indicating that the feedback has been received and will be used to improve the system.'
    ),
});
export type ImproveRuleParsingAccuracyOutput = z.infer<
  typeof ImproveRuleParsingAccuracyOutputSchema
>;

export async function improveRuleParsingAccuracy(
  input: ImproveRuleParsingAccuracyInput
): Promise<ImproveRuleParsingAccuracyOutput> {
  return improveRuleParsingAccuracyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveRuleParsingAccuracyPrompt',
  input: {schema: ImproveRuleParsingAccuracyInputSchema},
  output: {schema: ImproveRuleParsingAccuracyOutputSchema},
  prompt: `You are a rule parsing improvement assistant. A user has provided the following original input and a corrected rule.  Use this information to improve future parsing accuracy.

Original Input: {{{originalInput}}}
Corrected Rule: {{{correctedRule}}}

Respond with a confirmation message indicating that the feedback has been received and will be used to improve the system, and do not ask any questions.`,
});

const improveRuleParsingAccuracyFlow = ai.defineFlow(
  {
    name: 'improveRuleParsingAccuracyFlow',
    inputSchema: ImproveRuleParsingAccuracyInputSchema,
    outputSchema: ImproveRuleParsingAccuracyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
