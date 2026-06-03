import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardLayout } from "@/pages/DashboardLayout";
import { HistoryPage } from "@/pages/HistoryPage";
import { SplitsPage } from "@/pages/SplitsPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { WorkoutPage } from "@/pages/WorkoutPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<HistoryPage />} />
            <Route path="splits" element={<SplitsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="workout" element={<WorkoutPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}
