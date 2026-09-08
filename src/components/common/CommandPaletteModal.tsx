import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Search,
  DirectionsCar,
  Train,
  Bolt,
  WaterDrop,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteModalProps {
  open: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  name: string;
  code: string;
  sector: string;
  state: string;
  path: string;
  icon: React.ReactNode;
}

const SEARCH_ITEMS: CommandItem[] = [
  {
    id: 'NHAI-DEL-MUM-P4',
    name: 'Delhi-Mumbai Expressway — Package 4 (Vadodara to Kim Section)',
    code: 'NHAI-DEL-MUM-P4',
    sector: 'Highways',
    state: 'Gujarat',
    path: '/milestones',
    icon: <DirectionsCar sx={{ color: '#0284c7' }} fontSize="small" />,
  },
  {
    id: 'DFCCIL-EDFC-PKG-201',
    name: 'Eastern Dedicated Freight Corridor (Khurja-Ludhiana)',
    code: 'DFCCIL-EDFC-PKG-201',
    sector: 'Railways',
    state: 'UP / Haryana',
    path: '/inventory',
    icon: <Train sx={{ color: '#059669' }} fontSize="small" />,
  },
  {
    id: 'PGCIL-HVDC-RAIGARH',
    name: 'Raigarh-Pugalur 800kV HVDC Dipole Transmission Line',
    code: 'PGCIL-HVDC-RAIGARH',
    sector: 'Power',
    state: 'TN / Chhattisgarh',
    path: '/inventory',
    icon: <Bolt sx={{ color: '#d97706' }} fontSize="small" />,
  },
  {
    id: 'JJM-UP-BUND-08',
    name: 'Bundelkhand Surface Water Distribution Pipeline Pkg 8',
    code: 'JJM-UP-BUND-08',
    sector: 'Water',
    state: 'Uttar Pradesh',
    path: '/inventory',
    icon: <WaterDrop sx={{ color: '#0284c7' }} fontSize="small" />,
  },
  {
    id: 'SIMULATOR',
    name: 'Infrastructure What-If Delay Simulator & Countermeasure Engine',
    code: 'DECISION-SUPPORT',
    sector: 'Policy Levers',
    state: 'All India',
    path: '/simulator',
    icon: <Search sx={{ color: '#7c3aed' }} fontSize="small" />,
  },
  {
    id: 'EXECUTIVE-PORTFOLIO',
    name: 'Executive Portfolio Overview & CapEx S-Curve',
    code: 'PORTFOLIO-VIEW',
    sector: 'Analytics',
    state: 'National Book',
    path: '/',
    icon: <Search sx={{ color: '#0b2545' }} fontSize="small" />,
  },
];

export default function CommandPaletteModal({ open, onClose }: CommandPaletteModalProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
    }
  }, [open]);

  const filtered = SEARCH_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.code.toLowerCase().includes(query.toLowerCase()) ||
      item.state.toLowerCase().includes(query.toLowerCase()) ||
      item.sector.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: '1px solid #cbd5e1',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          top: '-15%',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5, borderBottom: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="Search projects, NH corridor, agency, state... [ESC to close]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: '#f8fafc',
                borderRadius: 1,
                fontSize: '0.88rem',
              },
            }}
          />
        </Box>

        <List sx={{ py: 1, maxHeight: 360, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <Typography variant="caption" sx={{ display: 'block', p: 3, textAlign: 'center', color: '#64748b' }}>
              No matching infrastructure packages found.
            </Typography>
          ) : (
            filtered.map((item) => (
              <ListItemButton
                key={item.id}
                onClick={() => handleSelect(item.path)}
                sx={{
                  px: 2.5,
                  py: 1.2,
                  borderBottom: '1px solid #f1f5f9',
                  '&:hover': { bgcolor: '#f1f5f9' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>
                        {item.name}
                      </Typography>
                      <Chip
                        label={item.code}
                        size="small"
                        sx={{
                          fontFamily: 'monospace',
                          height: 18,
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          bgcolor: '#e2e8f0',
                          color: '#0f172a',
                        }}
                      />
                    </Stack>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                      Sector: {item.sector} &bull; State: {item.state}
                    </Typography>
                  }
                />
                <ArrowForward sx={{ fontSize: 16, color: '#94a3b8' }} />
              </ListItemButton>
            ))
          )}
        </List>

        <Divider sx={{ borderColor: '#e2e8f0' }} />

        <Box sx={{ px: 2, py: 1, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
            Press <kbd style={{ padding: '2px 4px', background: '#e2e8f0', borderRadius: 4 }}>Ctrl+K</kbd> to open anywhere
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', fontFamily: 'monospace' }}>
            PM GatiShakti NMP Linked
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
