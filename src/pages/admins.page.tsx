import { useSearchParams, useLocation } from 'react-router-dom';
import { Box, Table, Tbody } from '@chakra-ui/react';

import TableHead from '../components/table-head.component';
import TableRow from '../components/table-row.component';
import Pagination from '../components/pagination.component';
import DeleteConfirmationModal from '../components/delete-confirmation-modal.component';

import { User } from '../declarations';

export const Admins = () => {
  const [params] = useSearchParams();
  const { pathname } = useLocation();

  const admins = [
    {
      id: 1,
      email: 'admin@gmail.com',
      createdAt: '2020-02-03',
    },
    {
      id: 2,
      email: 'admin@gmail.com',
      createdAt: '2020-02-02',
    },
    {
      id: 3,
      email: 'admin@gmail.com',
      createdAt: '2020-02-02',
    },
    {
      id: 4,
      email: 'admin@gmail.com',
      createdAt: '2020-02-02',
    },
  ];

  const getData = (admin: User) => {
    return [
      { id: 1, node: admin.id, title: 'ID' },
      { id: 2, node: admin.email, title: 'Email' },
      {
        id: 3,
        node: new Date(admin.createdAt || Date.now()).toLocaleString(),
        title: 'Дата создания',
      },
      {
        id: 4,
        node: <DeleteConfirmationModal />,
        title: 'Действия',
      },
    ];
  };

  return (
    <Box>
      <Table variant="simple" maxH="80vh" overflow="hidden">
        <TableHead titles={['ID', 'Email', 'Дата создания', 'Действия']} />
        <Tbody>
          {admins.map((admin) => {
            return <TableRow key={admin.id} data={getData(admin)} />;
          })}
        </Tbody>
      </Table>
      <Pagination
        pageNumber={Number(params.get('page')) || 1}
        url={pathname}
        total={admins.length}
      />
    </Box>
  );
};

export default Admins;
