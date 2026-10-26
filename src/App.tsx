import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";

const Home = lazy(() => import("@/pages/Home"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const WorkPage = lazy(() => import("@/pages/WorkPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const EstimatePage = lazy(() => import("@/pages/EstimatePage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/estimate" element={<EstimatePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/quote-builder"
              element={<Navigate to="/estimate" replace />}
            />
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
