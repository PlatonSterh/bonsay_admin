import { useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  refreshTokens,
  selectAccessTokenExpireAt,
  selectIsAuthenticated,
  selectRefreshToken,
  selectRefreshTokenExpireAt,
  signOut,
} from './store/core/core.slice';
import { navlinks } from './navlinks.config';
import Admins from './pages/admins.page';
import Categories from './pages/categories.page';
import Products from './pages/products.page';
import Navbar from './components/navbar.component';
import PageHeading from './components/page-heading.component';
import ErrorBoundary from './components/error-boundary.component';

const App = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in');
    }
  }, [navigate, isAuthenticated]);

  const refreshToken = useAppSelector(selectRefreshToken);
  const accessTokenExpireAt = useAppSelector(selectAccessTokenExpireAt);
  const refreshTokenExpireAt = useAppSelector(selectRefreshTokenExpireAt);

  useEffect(() => {
    if (refreshTokenExpireAt) {
      const expirationDate = new Date(refreshTokenExpireAt);

      const timeToLive = expirationDate.getTime() - Date.now();

      const timerId = setTimeout(
        () => {
          dispatch(signOut());
        },
        timeToLive > 0 ? timeToLive : 0
      );

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [dispatch, refreshTokenExpireAt]);

  useEffect(() => {
    if (accessTokenExpireAt) {
      const expirationDate = new Date(accessTokenExpireAt);

      const timeToLive = expirationDate.getTime() - Date.now();

      const timerId = setTimeout(
        () => {
          if (refreshToken) {
            dispatch(refreshTokens({ refreshToken }));
          }
        },
        timeToLive > 0 ? timeToLive : 0
      );

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [dispatch, refreshToken, accessTokenExpireAt]);

  return (
    <Flex width="full" height="full">
      <Navbar links={navlinks} />
      <Box
        width="full"
        height="full"
        paddingLeft="3.5rem"
        paddingBottom="0.5rem"
      >
        <PageHeading
          title={navlinks.find((navlink) => navlink.href === pathname)?.text}
        />
        <ErrorBoundary>
          <Routes>
            <Route index element={<Navigate to="products" />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="admins" element={<Admins />} />
          </Routes>
        </ErrorBoundary>
      </Box>
    </Flex>
  );
};

export default App;
