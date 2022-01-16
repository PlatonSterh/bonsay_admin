import { Flex, Box } from '@chakra-ui/react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Admins from './pages/admins.page';
import Clients from './pages/clients.page';
import Orders from './pages/orders.page';
import Categories from './pages/categories.page';
import Products from './pages/products.page';
import Navbar from './components/navbar.component';
import PageHeading from './components/page-heading.component';
import { navlinks } from './navlinks.config';

const App = () => {
  const { pathname } = useLocation();

  return (
    <Flex width="full" height="full">
      <Navbar links={navlinks} />
      <Box width="full" paddingLeft="3.5rem" paddingBottom="0.5rem">
        <PageHeading
          title={navlinks.find((navlink) => navlink.href === pathname)?.text}
        />
        <Routes>
          <Route index element={<Navigate to="products" />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="clients" element={<Clients />} />
          <Route path="admins" element={<Admins />} />
        </Routes>
      </Box>
    </Flex>
  );
};

export default App;
