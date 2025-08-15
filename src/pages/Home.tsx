import React, { startTransition } from "react"; // ✅ Adicionar startTransition
import { Link } from "react-router-dom"; // ✅ ADICIONAR IMPORT DO LINK
import { useNavigation } from "@shared/hooks/useNavigation";
import { useAuth } from "@features/auth/hooks/useAuth";
import { useCommonTranslation } from "@app/i18n/useTranslation";


const Home = () => {
   const { navigate } = useNavigation();
  const { isAuthenticated, user } = useAuth();
  const { t } = useCommonTranslation();

  const handleGetStarted = () => {
    // ✅ Envolver navegação com startTransition
    startTransition(() => {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/auth/register");
      }
    });
  };

  const handleLogin = () => {
    // ✅ Envolver navegação com startTransition
    startTransition(() => {
      navigate("/auth/login");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-900">B</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bazari</h1>
              <p className="text-sm text-primary-100">{t("web3SuperApp")}</p>
            </div>
          </div>

          {/* Botões com navegação corrigida */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-3">
            <span className="text-white">Olá, {user?.name || "Usuário"}</span>
            <button
              onClick={() => startTransition(() => navigate("/dashboard"))}
              className="bg-white text-primary-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Meu Perfil
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleLogin}
              className="text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary-900 transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={handleGetStarted}
              className="bg-secondary-500 text-white px-4 py-2 rounded-lg hover:bg-secondary-600 transition-colors"
            >
              Começar
            </button>
          </>
        )}
      </div>

        </header>

        {/* Hero Section */}
        <main className="text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              O Futuro do <br />
              <span className="text-secondary-400">Comércio Digital</span>
            </h2>
            
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Conecte, comercialize e cresça no primeiro super app Web3 que une 
              marketplace, rede social e economia descentralizada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleGetStarted}
                className="bg-secondary-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Começar Agora
              </button>
              
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-primary-900 transition-all duration-300"
              >
                Saiba Mais
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛒</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Marketplace</h3>
                <p className="text-primary-100">
                  Compre e venda produtos e serviços com segurança blockchain e pagamentos instantâneos.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Rede Social</h3>
                <p className="text-primary-100">
                  Conecte-se com outros usuários, compartilhe experiências e construa sua reputação.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Web3 Economy</h3>
                <p className="text-primary-100">
                  Tokenize seus ativos, participe da governança e ganhe com staking e NFTs.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
              <div>
                <div className="text-3xl font-bold text-secondary-400">1M+</div>
                <div className="text-primary-100">Usuários</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary-400">50K+</div>
                <div className="text-primary-100">Estabelecimentos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary-400">$10M+</div>
                <div className="text-primary-100">Transacionado</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary-400">99.9%</div>
                <div className="text-primary-100">Uptime</div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/20 text-center text-primary-100">
          <p>&copy; 2024 Bazari. {t("allRightsReserved")}.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;