import { Card, CardContent, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import StatusChip from '@/components/common/StatusChip';
import RiskBadge from '@/components/common/RiskBadge';
import type { ProjectListItem } from '@/types/project';
import { formatDelayDays } from '@/utils/formatters';

interface PortfolioSummaryTableProps {
  projects: ProjectListItem[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading: boolean;
}

export default function PortfolioSummaryTable({
  projects,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading,
}: PortfolioSummaryTableProps) {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Project', flex: 2, minWidth: 200 },
    { field: 'sector', headerName: 'Sector', flex: 1, minWidth: 130 },
    { field: 'state', headerName: 'State', flex: 1, minWidth: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'riskLevel',
      headerName: 'Risk',
      width: 130,
      renderCell: (params) => <RiskBadge level={params.value} />,
    },
    {
      field: 'physicalProgress',
      headerName: 'Progress',
      width: 100,
      valueFormatter: (params) => `${params.value}%`,
    },
    {
      field: 'predictedDelay',
      headerName: 'Pred. Delay',
      width: 120,
      valueFormatter: (params) => formatDelayDays(params.value as number),
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Project Portfolio
        </Typography>
        <DataGrid
          rows={projects}
          columns={columns}
          rowCount={total}
          paginationMode="server"
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            onPageChange(model.page);
            onPageSizeChange(model.pageSize);
          }}
          pageSizeOptions={[10, 25, 50]}
          loading={isLoading}
          onRowClick={(params) => navigate(`/projects/${params.id}`)}
          autoHeight
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-row': { cursor: 'pointer' },
          }}
        />
      </CardContent>
    </Card>
  );
}
