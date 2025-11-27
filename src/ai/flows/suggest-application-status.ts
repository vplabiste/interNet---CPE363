'use server';

/**
 * @fileOverview A flow that suggests the most relevant status ('Accepted,' 'Needs Resubmission,' or 'Rejected') for a submitted application.
 *
 * - suggestApplicationStatus - A function that suggests the application status.
 * - SuggestApplicationStatusInput - The input type for the suggestApplicationStatus function.
 * - SuggestApplicationStatusOutput - The return type for the suggestApplicationStatus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestApplicationStatusInputSchema = z.object({
  studentProfile: z
    .string()
    .describe('The profile of the student who submitted the application.'),
  historicalData: z
    .string()
    .describe(
      'Historical data on application acceptance rates for similar student profiles.'
    ),
  companyRequirements: z
    .string()
    .describe('The specific requirements for the job application.'),
});
export type SuggestApplicationStatusInput = z.infer<
  typeof SuggestApplicationStatusInputSchema
>;

const SuggestApplicationStatusOutputSchema = z.object({
  suggestedStatus: z
    .enum(['Accepted', 'Needs Resubmission', 'Rejected'])
    .describe('The suggested status for the application.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'A score between 0 and 1 indicating the confidence in the suggested status.'
    ),
  explanation: z
    .string()
    .describe(
      'An explanation of why the suggested status was recommended, based on the input data.'
    ),
});

export type SuggestApplicationStatusOutput = z.infer<
  typeof SuggestApplicationStatusOutputSchema
>;

export async function suggestApplicationStatus(
  input: SuggestApplicationStatusInput
): Promise<SuggestApplicationStatusOutput> {
  return suggestApplicationStatusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestApplicationStatusPrompt',
  input: {schema: SuggestApplicationStatusInputSchema},
  output: {schema: SuggestApplicationStatusOutputSchema},
  prompt: `You are an AI assistant helping company representatives to efficiently manage job applications.

  Based on the student's profile, historical data on application acceptance rates, and the company's requirements, suggest the most relevant status for the application.

  Provide a confidence score (0 to 1) indicating the certainty of your suggestion, and explain your reasoning.

  Student Profile: {{{studentProfile}}}
  Historical Data: {{{historicalData}}}
  Company Requirements: {{{companyRequirements}}}

  Consider all these factors to determine the most appropriate status.
  Always provide a confidence score and justification for your decision.
  Please suggest one of the following status: Accepted, Needs Resubmission, or Rejected.
  `,
});

const suggestApplicationStatusFlow = ai.defineFlow(
  {
    name: 'suggestApplicationStatusFlow',
    inputSchema: SuggestApplicationStatusInputSchema,
    outputSchema: SuggestApplicationStatusOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
