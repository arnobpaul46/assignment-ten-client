import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TransactionsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black italic">Recent <span className="text-[#ff1e6d]">Transactions</span></h2>
      <div className="bg-[#111113] border border-zinc-800/50 rounded-[35px] overflow-hidden">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-zinc-800">
              <TableHead className="px-8 font-bold text-zinc-500">TRANSACTION ID</TableHead>
              <TableHead className="font-bold text-zinc-500">TYPE</TableHead>
              <TableHead className="font-bold text-zinc-500">EMAIL</TableHead>
              <TableHead className="font-bold text-zinc-500">AMOUNT</TableHead>
              <TableHead className="text-right px-8 font-bold text-zinc-500">DATE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-zinc-800/50 hover:bg-white/[0.01]">
              <TableCell className="px-8 text-zinc-500 font-mono text-[11px]">TXN_98234710</TableCell>
              <TableCell className="font-bold">Book Purchase</TableCell>
              <TableCell className="text-zinc-400">user@example.com</TableCell>
              <TableCell className="text-green-500 font-black">+$15.50</TableCell>
              <TableCell className="text-right px-8 text-zinc-500 text-xs">Mar 12, 2025</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default TransactionsTab;