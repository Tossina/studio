"use server";

import { getAiPokerMove, PokerDecisionInput } from "@/ai/flows/ai-opponent";
import { chooseVariant, ChooseVariantInput } from "@/ai/flows/choose-variant";
import { Game } from "@/lib/types";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

export async function suggestVariantAction(input: ChooseVariantInput) {
  try {
    const result = await chooseVariant(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get suggestion from AI." };
  }
}

export async function getAiMoveAction(input: PokerDecisionInput) {
    try {
        const result = await getAiPokerMove(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to get AI move." };
    }
}
