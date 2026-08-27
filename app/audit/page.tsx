import { AuditTool } from '@/components/AuditTool';
import { PageHeader } from '@/components/PageHeader';

export default function AuditPage() {
  return <>
    <PageHeader eyebrow="Revenue audit" title="Delivery-to-cash workflow audit" description="Use this live checklist during a discovery call to turn operational friction into a structured, measurable conversation."/>
    <AuditTool/>
  </>;
}
