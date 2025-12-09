'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Game, Player } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const FormSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères.'),
  gameVariant: z.enum(["Texas Hold'em", 'Omaha']),
  gameFormat: z.enum(['Cash Game', 'MTT', 'Sit & Go']),
  stakes: z.string().regex(/^\d+\/\d+$/, 'Les mises doivent être au format "nombre/nombre", ex: 5/10'),
});

type CreateGameFormValues = z.infer<typeof FormSchema>;

interface CreateGameFormProps {
    setOpen: (open: boolean) => void;
}

export function CreateGameForm({ setOpen }: CreateGameFormProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateGameFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      gameVariant: "Texas Hold'em",
      gameFormat: 'Cash Game',
      stakes: '5/10',
    },
  });

  async function onSubmit(data: CreateGameFormValues) {
    if (!firestore || !user) return;
    setIsLoading(true);

    const gamesCollection = collection(firestore, 'pokerGames');
    
    const heroPlayer: Player = {
        id: user.uid,
        name: user.displayName || user.email || 'Joueur',
        avatarUrl: user.photoURL || PlaceHolderImages.find(p => p.id === 'avatar-5')?.imageUrl || '',
        stack: 10000, // Initial stack for the game
        isDealer: false,
        isTurn: false,
        cards: null,
        position: 1,
        action: null,
        betAmount: 0,
    };

    const players: Player[] = [heroPlayer];
    // Add empty seats
    for (let i = 2; i <= 9; i++) {
        players.push({
            id: `empty-${i}`,
            name: 'Siège vide',
            avatarUrl: '',
            stack: 0,
            isDealer: false,
            isTurn: false,
            cards: null,
            position: i,
            action: null,
            betAmount: 0,
        });
    }

    const newGame: Omit<Game, 'id'> = {
        name: data.name,
        gameVariant: data.gameVariant,
        gameFormat: data.gameFormat,
        stakes: `${data.stakes} Ar`,
        players: players,
        maxPlayers: 9,
        limit: 'No Limit',
        status: 'EN COURS',
        playerIds: [user.uid],
        startTime: new Date().toISOString(),
        communityCards: [],
        pot: 0,
        currentPlayerId: user.uid,
        gamePhase: 'pre-flop',
        dealerPosition: 1,
    };

    try {
        await addDocumentNonBlocking(gamesCollection, newGame);
        toast({
            title: "Table créée !",
            description: `La table "${data.name}" a été ajoutée au lobby.`,
        });
        setOpen(false);
    } catch(e) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de créer la table.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la table</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Table des requins" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gameVariant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variante</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une variante" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Texas Hold'em">Texas Hold'em</SelectItem>
                  <SelectItem value="Omaha">Omaha</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gameFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Cash Game">Cash Game</SelectItem>
                  <SelectItem value="Sit & Go">Sit & Go</SelectItem>
                  <SelectItem value="MTT">Tournoi (MTT)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stakes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mises (Blinds)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 100/200" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer la table
        </Button>
      </form>
    </Form>
  );
}
