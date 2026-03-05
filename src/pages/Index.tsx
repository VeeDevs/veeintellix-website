import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductRotator from "@/components/ProductRotator";
import BubbleChallenge from "@/components/BubbleChallenge";
import ArticlesInsights from "@/components/ArticlesInsights";
import ConsultationForm from "@/components/ConsultationForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ProductRotator />
      <BubbleChallenge />
      <ArticlesInsights />
      <ConsultationForm />
      <Footer />
    </div>
  );
};

export default Index;
