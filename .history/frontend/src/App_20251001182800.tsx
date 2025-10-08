

// frontend/src/app.tsx
import React from 'react';
import { auth } from "./firebase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ProtectedRoute from "./components/ProtectedRoute";

// UI and Context Providers
import { AuthProvider } from "./context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from 'react-hot-toast';

// Page and Component Imports
import { HomePage } from "./components/HomePage";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { CanvasEditor } from "./components/CanvasEditor";
import { TemplatesPage } from "./components/TemplatesPage";
import NotFound from "./pages/NotFound";
import Dashboard from './components/Dashboard';


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            }
          }}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/editor"
              element={
                <ProtectedRoute>
                  <CanvasEditor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/editor/:designId"
              element={
                <ProtectedRoute>
                  <CanvasEditor />
                </ProtectedRoute>
              }
            />


            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

