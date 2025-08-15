import React, { useMemo } from "react";
import { Link } from "react-router-dom";
// usamos apenas o Card que já existe no projeto
import { Card } from "@/shared/ui/Card";

/**
 * Helpers simples para tentar mostrar alguns KPIs sem acoplar serviços.
 * Lê localStorage com chaves prováveis usadas no módulo Marketplace.
 * Se não achar, mostra "—".
 */
function useMarketplaceKpis() {
  return useMemo(() => {
    const safeParse = (key: string): any[] => {
      try {
        const raw =
          localStorage.getItem(key) ||
          localStorage.getItem(key.toUpperCase()) ||
          localStorage.getItem(key.toLowerCase());
        if (!raw) return [];
        const json = JSON.parse(raw);
        if (Array.isArray(json)) return json;
        if (Array.isArray(json?.items)) return json.items;
        if (Array.isArray(json?.data)) return json.data;
        return [];
      } catch {
        return [];
      }
    };

    // tentativas de chaves comuns
    const businesses =
      safeParse("marketplace:businesses") ||
      safeParse("bazari:marketplace:businesses");
    const products =
      safeParse("marketplace:products") ||
      safeParse("bazari:marketplace:products");

    return {
      businessesCount: businesses?.length || 0,
      productsCount: products?.length || 0,
    };
  }, []);
}

export default function DashboardHome() {
  const { businessesCount, productsCount } = useMarketplaceKpis();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
      {/* HERO */}
      <section className="mb-6 md:mb-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Bem-vindo(a) ao seu painel
            </h1>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Acesse rapidamente Marketplace, Wallet, DAO, Work e Social —
              tudo em um só lugar.
            </p>
          </div>

          {/* Atalhos principais */}
          <div className="flex flex-wrap gap-2">
            <Link
              to="/marketplace"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Ir para Marketplace
            </Link>
            <Link
              to="/wallet"
              className="rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Abrir Wallet
            </Link>
            <Link
              to="/dao"
              className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              Governança (DAO)
            </Link>
          </div>
        </div>
      </section>

      {/* KPIs RÁPIDOS */}
      <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="text-xs uppercase text-muted-foreground">
            Negócios
          </div>
          <div className="mt-1 text-2xl font-semibold">
            {businessesCount || "—"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Estabelecimentos ativos no Marketplace
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs uppercase text-muted-foreground">
            Produtos
          </div>
          <div className="mt-1 text-2xl font-semibold">
            {productsCount || "—"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Itens publicados (mock/local)
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs uppercase text-muted-foreground">
            Carteiras
          </div>
          <div className="mt-1 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Contas gerenciadas (multi-conta)
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs uppercase text-muted-foreground">
            Propostas DAO
          </div>
          <div className="mt-1 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Últimos 30 dias
          </div>
        </Card>
      </section>

      {/* MÓDULOS PRINCIPAIS */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">
          Módulos do ecossistema
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Marketplace */}
          <Link to="/marketplace">
            <Card className="group h-full cursor-pointer p-5 transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Marketplace</h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  Loja & Produtos
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore estabelecimentos, produtos físicos e digitais, filtros
                avançados e páginas de detalhe.
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                {businessesCount} negócios • {productsCount} produtos
              </div>
            </Card>
          </Link>

          {/* Wallet */}
          <Link to="/wallet">
            <Card className="group h-full cursor-pointer p-5 transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Wallet</h3>
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-700">
                  BZR • Tokens • NFTs
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Multi-conta, multi-ativos, histórico e (futuro) staking BZR. Tudo preparado
                para integrar Substrate.
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                Gerencie contas e ativos com segurança.
              </div>
            </Card>
          </Link>

          {/* DAO */}
          <Link to="/dao">
            <Card className="group h-full cursor-pointer p-5 transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">DAO</h3>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-700">
                  Governança
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Crie propostas, vote e acompanhe a tesouraria da comunidade Bazari.
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                Autonomia e transparência on-chain (mock por enquanto).
              </div>
            </Card>
          </Link>

          {/* Work / Protocolo de Trabalho */}
          <Link to="/work">
            <Card className="group h-full cursor-pointer p-5 transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Work</h3>
                <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-xs text-sky-700">
                  Projetos & Escrow
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Marketplace de projetos com propostas, milestones e escrow
                (mockado), pronto para IPFS.
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                Crie projetos ou envie propostas como freelancer.
              </div>
            </Card>
          </Link>

          {/* Social */}
          <Link to="/social">
            <Card className="group h-full cursor-pointer p-5 transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Social</h3>
                <span className="rounded-full bg-fuchsia-500/15 px-2 py-0.5 text-xs text-fuchsia-700">
                  Comunidade
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Conecte-se com a comunidade, compartilhe atualizações e
                acompanhe novidades do ecossistema.
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                Também acesse{" "}
                <Link
                  to="/search/users"
                  className="underline decoration-dotted underline-offset-4 hover:text-foreground"
                >
                  busca de usuários
                </Link>
                .
              </div>
            </Card>
          </Link>

          {/* Marketplace Digital (se aplicável) */}
          <Link to="/marketplace/digital">
            <Card className="group h-full cursor-pointer p-5 transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Digitais</h3>
                <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-xs text-purple-700">
                  Produtos tokenizados
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore o catálogo de itens digitais, com prova on-chain e
                acesso controlado (mock).
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                Uploads, licença e royalties (wizard).
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* ATIVIDADE / ATALHOS SECUNDÁRIOS */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">
          Ações rápidas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/marketplace/business/create">
            <Card className="group h-full cursor-pointer p-4 transition hover:shadow-md">
              <div className="text-sm font-medium">Cadastrar negócio</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Crie uma nova loja/estabelecimento
              </div>
            </Card>
          </Link>

          <Link to="/marketplace/product/create">
            <Card className="group h-full cursor-pointer p-4 transition hover:shadow-md">
              <div className="text-sm font-medium">Publicar produto</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Adicione itens ao seu catálogo
              </div>
            </Card>
          </Link>

          <Link to="/work/new">
            <Card className="group h-full cursor-pointer p-4 transition hover:shadow-md">
              <div className="text-sm font-medium">Novo projeto (Work)</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Abra demanda com milestones e escrow
              </div>
            </Card>
          </Link>

          <Link to="/dao/create">
            <Card className="group h-full cursor-pointer p-4 transition hover:shadow-md">
              <div className="text-sm font-medium">Nova proposta (DAO)</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Submeta uma melhoria para votação
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* DICAS / LINKS ÚTEIS */}
      <section>
        <Card className="p-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <div className="text-sm font-semibold">
                Dica: personalize seu perfil público
              </div>
              <div className="text-sm text-muted-foreground">
                Ajuste avatar, bio e links — isso ajuda sua loja, propostas e
                interação social a performarem melhor.
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to="/profile"
                className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Meu perfil
              </Link>
              <Link
                to="/search"
                className="rounded-md bg-secondary px-3 py-2 text-sm font-medium hover:opacity-90"
              >
                Buscar usuários
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
