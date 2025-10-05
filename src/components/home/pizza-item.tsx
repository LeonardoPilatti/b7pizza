'use client';

import { Product } from '@/generated/prisma';
import Image from 'next/image';
import { Button } from '../ui/button';
import { decimalToMoney } from '@/lib/utils';
import { useCart } from '@/stores/cart';
import { ShoppingCart, Heart, Star, Flame } from 'lucide-react';
import { useState } from 'react';

type PizzaItemType = {
  data: Product;
};

export const PizzaItem = ({ data }: PizzaItemType) => {
  const cart = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCard = async () => {
    setIsAdding(true);
    cart.addItem({
      productId: data.id,
      quantity: 1,
    });

    // Feedback visual
    await new Promise((resolve) => setTimeout(resolve, 250));
    cart.setOpen(true);
    setIsAdding(false);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Simular avaliação (você pode buscar do banco depois)
  const rating = 3.5;
  const isPopular = parseFloat(data.price.toString()) > 40; // Pizzas mais caras são "populares"

  return (
    <article
      className="group relative bg-gradient-to-b from-card to-card/95 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/50"
      aria-label={`Pizza ${data.name}`}
    >
      {/* Badge Popular */}
      {isPopular && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
          <Flame className="h-3 w-3" aria-hidden="true" />
          Popular
        </div>
      )}

      {/* Botão Favorito */}
      <button
        onClick={toggleFavorite}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
          isFavorite
            ? 'bg-red-500 text-white scale-110'
            : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-110'
        }`}
        aria-label={
          isFavorite
            ? `Remover ${data.name} dos favoritos`
            : `Adicionar ${data.name} aos favoritos`
        }
      >
        <Heart
          className={`h-4 w-4 transition-all duration-300 ${
            isFavorite ? 'fill-current' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Imagem com Efeitos */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <Image
          src={data.image}
          alt={data.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-3"
          priority={false}
        />

        {/* Overlay com Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge de Preço Sempre Visível */}
        <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-900 text-foreground px-4 py-2 rounded-full font-bold text-lg shadow-xl">
          {decimalToMoney(data.price)}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 space-y-3">
        {/* Avaliação */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : i < rating
                    ? 'fill-yellow-400/50 text-yellow-400/50'
                    : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {rating.toFixed(1)} (127)
          </span>
        </div>

        {/* Nome */}
        <h3 className="font-bold text-xl leading-tight min-h-[3.5rem] line-clamp-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          {data.name}
        </h3>

        {/* Ingredientes com Ícone */}
        <div className="flex items-start gap-2 min-h-[3rem]">
          <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {data.ingredients}
          </div>
        </div>

        {/* Botão de Adicionar com Animação */}
        <Button
          onClick={handleAddToCard}
          disabled={isAdding}
          className={`w-full group/btn cursor-pointer relative overflow-hidden transition-all duration-300 ${
            isAdding
              ? 'bg-green-500 hover:bg-green-500'
              : 'hover:shadow-lg hover:shadow-primary/20'
          }`}
          size="lg"
          aria-label={`Adicionar ${data.name} ao carrinho`}
        >
          {/* Efeito de ondulação */}
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left" />

          <span className="relative flex items-center justify-center gap-2">
            {isAdding ? (
              <>
                <div
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                Adicionando...
              </>
            ) : (
              <>
                <ShoppingCart
                  className="h-4 w-4 transition-transform group-hover/btn:scale-110 group-hover/btn:-rotate-12"
                  aria-hidden="true"
                />
                Adicionar ao Carrinho
              </>
            )}
          </span>
        </Button>
      </div>

      {/* Brilho decorativo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
    </article>
  );
};
