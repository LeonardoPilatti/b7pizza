'use client';

import { Product } from '@/generated/prisma';
import { PizzaItem } from './pizza-item';
import { useProducts } from '@/stores/products';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Pizza, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/input';

type PizzaListType = {
  pizzas: Product[];
};

export const PizzaList = ({ pizzas }: PizzaListType) => {
  const products = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>(
    'name',
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => products.setProducts(pizzas), []);

  // Filtrar e ordenar pizzas
  const filteredPizzas = pizzas
    .filter(
      (pizza) =>
        pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pizza?.ingredients?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return Number(a.price) - Number(b.price);
        case 'price-desc':
          return Number(b.price) - Number(a.price);
        default:
          return 0;
      }
    });

  return (
    <section aria-labelledby="pizza-list-heading" className="py-8 space-y-6">
      {/* Header com Título e Contagem */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2
            id="pizza-list-heading"
            className="text-3xl font-bold flex items-center gap-2"
          >
            <Pizza className="h-8 w-8 text-primary" aria-hidden="true" />
            Nossas Pizzas
          </h2>
          <p className="text-muted-foreground">
            {filteredPizzas.length}{' '}
            {filteredPizzas.length === 1
              ? 'pizza disponível'
              : 'pizzas disponíveis'}
          </p>
        </div>

        {/* Botão de Filtros (Mobile) */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden cursor-pointer"
          aria-expanded={showFilters}
          aria-controls="filter-section"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" aria-hidden="true" />
          {showFilters ? 'Ocultar Filtros' : 'Filtros'}
        </Button>
      </div>

      {/* Barra de Busca e Filtros */}
      <div
        id="filter-section"
        className={`flex flex-col sm:flex-row gap-4 p-4 bg-secondary/30 backdrop-blur-sm rounded-lg border transition-all duration-300 ${
          showFilters ? 'block' : 'hidden sm:flex'
        }`}
      >
        {/* Busca */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Buscar por nome ou ingredientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Buscar pizzas"
          />
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-select"
            className="text-sm font-medium whitespace-nowrap"
          >
            Ordenar por:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 bg-background border rounded-md text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Ordenar pizzas"
          >
            <option value="name">Nome (A-Z)</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
          </select>
        </div>
      </div>

      {/* Grid de Pizzas */}
      {filteredPizzas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {filteredPizzas.map((item, index) => (
            <div
              key={item.id}
              className="animate-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <PizzaItem data={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-4">
          <div className="text-6xl">🍕</div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Nenhuma pizza encontrada
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? `Não encontramos pizzas com "${searchTerm}". Tente outro termo.`
                : 'Nenhuma pizza disponível no momento.'}
            </p>
          </div>
          {searchTerm && (
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
              className="cursor-pointer"
            >
              Limpar Busca
            </Button>
          )}
        </div>
      )}
    </section>
  );
};
