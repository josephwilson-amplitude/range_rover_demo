import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { BuildProvider } from "@/context/BuildContext";
import SiteLayout from "@/components/site/SiteLayout";
import Home from "@/pages/Home";
import VehiclesIndex from "@/pages/VehiclesIndex";
import VehicleDetail from "@/pages/VehicleDetail";
import Configure from "@/pages/Configure";
import Quote from "@/pages/Quote";
import EnquiryConfirmed from "@/pages/EnquiryConfirmed";
import Account from "@/pages/Account";
import { Owners, Explore, Shop, Retailer, Support, Builds, Finance, SearchPage } from "@/pages/SimplePages";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <BuildProvider>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/vehicles" element={<VehiclesIndex />} />
                <Route path="/vehicles/:slug" element={<VehicleDetail />} />
                <Route path="/build/:slug" element={<Configure />} />
                <Route path="/quote/:slug" element={<Quote />} />
                <Route path="/enquiry/confirmed" element={<EnquiryConfirmed />} />
                <Route path="/account" element={<Account />} />
                <Route path="/owners" element={<Owners />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/retailer" element={<Retailer />} />
                <Route path="/support" element={<Support />} />
                <Route path="/builds" element={<Builds />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BuildProvider>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
