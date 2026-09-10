import { db } from '../data/db';
import { randomUUID } from 'crypto';

export function generateAlerts(): { generated: number; alerts: any[] } {
  const projectsRes = db.getProjectsList({ pageSize: 10000 });
  const projects = projectsRes.items;
  const currentAlerts = db.getAlerts({ pageSize: 10000 }).items || [];
  
  const existingAlertKeys = new Set(currentAlerts.map(a => `${a.projectId}-${a.category}`));

  let generatedCount = 0;
  const newAlerts: any[] = [];

  for (const project of projects) {
    if (project.riskLevel === 'high' || project.riskLevel === 'critical') {
      if (project.predictedDelay > 180) {
        const key = `${project.id}-delay`;
        if (!existingAlertKeys.has(key)) {
          const alert = {
            id: randomUUID(),
            projectId: project.id,
            projectName: project.name,
            sector: project.sector,
            severity: 'critical' as const,
            category: 'delay',
            title: 'Critical Delay Risk',
            message: `Predicted delay exceeds 180 days (${project.predictedDelay} days).`,
            createdAt: new Date().toISOString(),
            isRead: false
          };
          db.addAlert(alert);
          newAlerts.push(alert);
          generatedCount++;
          existingAlertKeys.add(key);
        }
      }
      
      const blocker = project.primaryBottleneck?.toLowerCase() || '';
      if (blocker.includes('land') || blocker.includes('acquisition') || blocker.includes('compensation') || blocker.includes('rfctlarr')) {
        const key = `${project.id}-land_acquisition`;
        if (!existingAlertKeys.has(key)) {
          const alert = {
            id: randomUUID(),
            projectId: project.id,
            projectName: project.name,
            sector: project.sector,
            severity: 'high' as const,
            category: 'land_acquisition',
            title: 'Critical Land Acquisition Blocker',
            message: `Project has a critical land acquisition blocker: ${project.primaryBottleneck}`,
            createdAt: new Date().toISOString(),
            isRead: false
          };
          db.addAlert(alert);
          newAlerts.push(alert);
          generatedCount++;
          existingAlertKeys.add(key);
        }
      }
    }

    if (project.predictedDelay > 365) {
      const key = `${project.id}-statutory_lapsing`;
      if (!existingAlertKeys.has(key)) {
        const alert = {
          id: randomUUID(),
          projectId: project.id,
          projectName: project.name,
          sector: project.sector,
          severity: 'critical' as const,
          category: 'statutory_lapsing',
          title: 'Section 25 Statutory Lapsing Risk',
          message: `Predicted delay exceeds 365 days, risking Section 25 statutory lapsing.`,
          createdAt: new Date().toISOString(),
          isRead: false
        };
        db.addAlert(alert);
        newAlerts.push(alert);
        generatedCount++;
        existingAlertKeys.add(key);
      }
    }
  }

  return { generated: generatedCount, alerts: newAlerts };
}
