import { AuditTool } from '@/components/AuditTool';
import { PageHeader } from '@/components/PageHeader';

export default function AuditPage() {
  return <>
    <PageHeader eyebrow="DELIVERY-TO-CASH AUDIT" title="Find the workflow gaps" description="Use this interactive checklist during discovery to turn vague operational pain into a structured conversation."/>
    <AuditTool/>
  </>;
}
