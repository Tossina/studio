// This is an AI-powered poker opponent for practice and solo play.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PokerDecisionInputSchema = z.object({
  gameType: z.enum(['Texas Holdem', 'Omaha', 'Stud', 'Draw']).describe('The type of poker game being played.'),
  gameState: z.string().describe('A description of the current game state, including player positions, current bets, and community cards.'),
  playerCards: z.string().describe('A description of the player hand.'),
});

export type PokerDecisionInput = z.infer<typeof PokerDecisionInputSchema>;

const PokerDecisionOutputSchema = z.object({
  action: z.enum(['fold', 'check', 'call', 'raise']).describe('The AI opponent action'),
  betSize: z.number().optional().describe('The amount to bet if the action is raise'),
  reasoning: z.string().describe('The AI opponents reasoning for the selected action.'),
});

export type PokerDecisionOutput = z.infer<typeof PokerDecisionOutputSchema>;

export async function getAiPokerMove(input: PokerDecisionInput): Promise<PokerDecisionOutput> {
  return aiOpponentFlow(input);
}

const aiOpponentPrompt = ai.definePrompt({
  name: 'aiOpponentPrompt',
  input: {schema: PokerDecisionInputSchema},
  output: {schema: PokerDecisionOutputSchema},
  prompt: `You are an AI poker opponent designed to play poker. Please take the following context into account to properly play the game.

  Game Type: {{{gameType}}}
  Game State: {{{gameState}}}
  Player Cards: {{{playerCards}}}

  Based on the game type, game state, and player cards, decide on an appropriate action. Provide a brief reasoning for your choice.
  Output your decision in JSON format:
  { 
    "action": "<fold|check|call|raise>",
    "betSize": <number, only if action is raise>,
    "reasoning": "<your reasoning>"
  }
  `,
});

const aiOpponentFlow = ai.defineFlow(
  {
    name: 'aiOpponentFlow',
    inputSchema: PokerDecisionInputSchema,
    outputSchema: PokerDecisionOutputSchema,
  },
  async input => {
    const {output} = await aiOpponentPrompt(input);
    return output!;
  }
);
