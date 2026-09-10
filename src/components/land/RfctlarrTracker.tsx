import React, { useMemo } from 'react';
import { Box, Paper, Stepper, Step, StepLabel, Chip, Alert, Typography, Stack, Button } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

interface RfctlarrTrackerProps {
  projectId: string;
  projectName: string;
  state: string;
  currentStage?: number;
}

const STAGES = [
  { label: 'SIA Notification', section: 'Section 4', statutoryDays: null },
  { label: 'Preliminary Notification', section: 'Section 11', statutoryDays: null },
  { label: 'Hearing of Objections', section: 'Section 15', statutoryDays: 60 },
  { label: 'Declaration of Acquisition', section: 'Section 19', statutoryDays: 365 },
  { label: 'Award by Collector', section: 'Section 23', statutoryDays: 365 },
  { label: 'Possession', section: 'Section 24', statutoryDays: null },
];

export default function RfctlarrTracker({ projectId, projectName, state, currentStage }: RfctlarrTrackerProps) {
  const stage = currentStage ?? useMemo(() => {
    let hash = 0;
    for (let i = 0; i < projectId.length; i++) {
      hash = projectId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 6;
  }, [projectId]);

  const entryDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - (Math.abs(projectId.charCodeAt(0)) % 100) - 20);
    return d;
  }, [projectId]);

  const daysInStage = useMemo(() => {
    const diffTime = Math.abs(new Date().getTime() - entryDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [entryDate]);

  const currentStageInfo = STAGES[stage];
  
  let daysRemaining = -1;
  if (currentStageInfo.statutoryDays) {
    daysRemaining = currentStageInfo.statutoryDays - daysInStage;
  }

  const isLapsing = daysRemaining !== -1 && daysRemaining < 0;

  return (
    <Box sx={{ py: 2 }}>
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 1, mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#0b2545', fontWeight: 800, mb: 0.5 }}>
          RFCTLARR Act 2013 Statutory Tracker
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 4, fontSize: '0.8rem' }}>
          {projectName} &bull; {state}
        </Typography>

        <Stepper activeStep={stage} alternativeLabel sx={{ mb: 5 }}>
          {STAGES.map((s, index) => {
            const isCompleted = index < stage;
            const isCurrent = index === stage;
            
            return (
              <Step key={s.section}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-active': { color: '#0b2545' },
                      '&.Mui-completed': { color: '#15803d' },
                    }
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: isCurrent ? 800 : 600, color: isCurrent ? '#0b2545' : isCompleted ? '#15803d' : '#94a3b8', display: 'block' }}>
                    {s.label}
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#64748b' }}>
                    {s.section}
                  </Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <Box sx={{ p: 2.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                Current Stage: {currentStageInfo.section} - {currentStageInfo.label}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                Entered: {entryDate.toLocaleDateString()} ({daysInStage} days ago)
              </Typography>
            </Box>
            
            {daysRemaining !== -1 && !isLapsing && (
              <Chip 
                label={`${daysRemaining} Days to Deadline`} 
                size="small" 
                sx={{ 
                  fontWeight: 800, 
                  bgcolor: daysRemaining < 30 ? '#fee2e2' : daysRemaining < 90 ? '#fef3c7' : '#dcfce7',
                  color: daysRemaining < 30 ? '#ef4444' : daysRemaining < 90 ? '#d97706' : '#15803d'
                }} 
              />
            )}
            {isLapsing && (
              <Chip 
                label={`Deadline Exceeded by ${Math.abs(daysRemaining)} Days`} 
                size="small" 
                sx={{ fontWeight: 800, bgcolor: '#fee2e2', color: '#ef4444' }} 
              />
            )}
          </Stack>

          <Typography variant="body2" sx={{ color: '#475569', mb: 2.5, fontSize: '0.85rem' }}>
            Bottleneck: Verification of local land records and alignment maps pending with State Revenue Department. Requires immediate coordination to clear encumbrances.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label="Required: Land Schedule" size="small" variant="outlined" sx={{ fontSize: '0.7rem', fontWeight: 600 }} />
            <Chip label="Required: Expert Group Appraisal" size="small" variant="outlined" sx={{ fontSize: '0.7rem', fontWeight: 600 }} />
          </Stack>

          <Button size="small" sx={{ textTransform: 'none', fontWeight: 700, p: 0, mt: 1 }}>
            View delay prediction factors &rarr;
          </Button>
        </Box>

        {isLapsing && (
          <Alert severity="error" icon={<WarningAmber />} sx={{ mt: 3, fontWeight: 700, border: '1px solid #fecdd3' }}>
            CAUTION: Section 25 Lapsing Warning! The statutory clock has expired. The acquisition proceedings are at risk of lapsing, and Section 11 must be re-notified if action is not taken immediately.
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
