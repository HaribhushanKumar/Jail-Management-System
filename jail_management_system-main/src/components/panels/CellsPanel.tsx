import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface Cell {
  id: string;
  cellNumber: string;
  block: string;
  capacity: number;
  currentOccupancy: number;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Closed';
  inmates: string[];
}

const CellsPanel = () => {
  const [cells, setCells] = useState<Cell[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [blockFilter, setBlockFilter] = useState<string>('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCell, setNewCell] = useState({
    cellNumber: '',
    block: '',
    capacity: '',
    status: 'Available' as 'Available' | 'Occupied' | 'Maintenance' | 'Closed',
  });

  const [blockOptions, setBlockOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/cell-block')
      .then((res) => res.json())
      .then((data) => {
        const names = data.map((block: any) => block.name);
        setBlockOptions(names);
      })
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Failed to load block options',
          variant: 'destructive',
        })
      );
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/cells')
      .then((res) => res.json())
      .then((data) => setCells(data))
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Failed to load cells data',
          variant: 'destructive',
        })
      );
  }, []);

  const filteredCells = cells.filter((cell) => {
    const matchesSearch =
      (cell.cellNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (cell.block?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'All' || cell.status === statusFilter;
    const matchesBlock = blockFilter === 'All' || cell.block === blockFilter;
    return matchesSearch && matchesStatus && matchesBlock;
  });

  const handleAddCell = () => {
    if (!newCell.cellNumber || !newCell.block || !newCell.capacity) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const cellToPost = {
      cellNumber: newCell.cellNumber,
      block: newCell.block,
      capacity: parseInt(newCell.capacity),
      currentOccupancy: 0,
      status: newCell.status,
      inmates: [],
    };

    fetch('http://localhost:8080/api/cells', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cellToPost),
    })
      .then((res) => res.json())
      .then((newCell) => {
        setCells([...cells, newCell]);
        setNewCell({ cellNumber: '', block: '', capacity: '', status: 'Available' });
        setIsAddDialogOpen(false);
        toast({
          title: 'Success',
          description: 'Cell added successfully',
        });
      })
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Failed to add cell',
          variant: 'destructive',
        })
      );
  };

  const handleStatusChange = (id: string, newStatus: Cell['status']) => {
    const target = cells.find((c) => c.id === id);
    if (!target) return;

    fetch(`http://localhost:8080/api/cells/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...target, status: newStatus }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setCells(cells.map((c) => (c.id === id ? updated : c)));
        toast({
          title: 'Success',
          description: `Cell status updated to ${newStatus}`,
        });
      })
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Failed to update status',
          variant: 'destructive',
        })
      );
  };

  const getStatusOptions = (cell: Cell) => {
    const derivedStatus =
      cell.currentOccupancy >= cell.capacity ? 'Occupied' : 'Available';

    return cell.status === 'Maintenance'
      ? ['Maintenance', derivedStatus]
      : ['Maintenance', cell.status];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Cells Management</h2>
          <p className="text-slate-600">Monitor and manage cell assignments</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              Add New Cell
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Cell</DialogTitle>
              <DialogDescription>
                Enter the cell information below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cellNumber">Cell Number</Label>
                <Input
                  id="cellNumber"
                  value={newCell.cellNumber}
                  onChange={(e) =>
                    setNewCell({ ...newCell, cellNumber: e.target.value })
                  }
                  placeholder="e.g., A-101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="block">Block</Label>
                <Select
                  value={newCell.block}
                  onValueChange={(value) =>
                    setNewCell({ ...newCell, block: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select block" />
                  </SelectTrigger>
                  <SelectContent>
                    {blockOptions.map((block) => (
                      <SelectItem key={block} value={block}>
                        {block}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newCell.capacity}
                  onChange={(e) =>
                    setNewCell({ ...newCell, capacity: e.target.value })
                  }
                  placeholder="Number of inmates"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddCell}>
                Add Cell
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Input
          placeholder="Search cells..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-4 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Occupied">Occupied</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={blockFilter} onValueChange={setBlockFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by block" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {blockOptions.map((block) => (
                <SelectItem key={block} value={block}>
                  {block}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-slate-600">Total: {cells.length} cells</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCells.map((cell) => (
          <Card key={cell.id} className="bg-white border-slate-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{cell.cellNumber}</CardTitle>
                  <CardDescription>Block {cell.block}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Status:</span>
                <Select
                  value={cell.status}
                  onValueChange={(value: 'Available' | 'Occupied' | 'Maintenance' | 'Closed') =>
                    handleStatusChange(cell.id, value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions(cell).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-600">Occupancy:</span>
                  <span>
                    {cell.currentOccupancy}/{cell.capacity}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(cell.currentOccupancy / cell.capacity) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {cell.inmates.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-slate-600">
                    Current Inmates:
                  </span>
                  <ul className="mt-1 space-y-1">
                    {cell.inmates.map((inmate, index) => (
                      <li
                        key={index}
                        className="text-sm text-slate-700 bg-slate-50 p-2 rounded"
                      >
                        {inmate}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCells.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No cells found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default CellsPanel;
