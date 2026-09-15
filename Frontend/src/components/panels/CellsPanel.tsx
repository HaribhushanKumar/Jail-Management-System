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
import { ArrowLeft, Edit3, Plus } from 'lucide-react';
import { API_BASE_URL } from '@/config/apiConfig';

interface Cell {
  id: string;
  cellNumber: string;
  block: string;
  capacity: number;
  currentOccupancy: number;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Closed';
  inmates: string[];
}

interface CellsPanelProps {
  onBack?: () => void;
}

const CellsPanel = ({ onBack }: CellsPanelProps) => {
  const [cells, setCells] = useState<Cell[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [blockFilter, setBlockFilter] = useState<string>('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<Cell | null>(null);

  const [newCell, setNewCell] = useState({
    cellNumber: '',
    block: '',
    capacity: '',
    status: 'Available' as 'Available' | 'Occupied' | 'Maintenance' | 'Closed',
  });

  const [blockOptions, setBlockOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/cell-block`)
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
    fetch(`${API_BASE_URL}/api/cells`)
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

    fetch(`${API_BASE_URL}/api/cells`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cellToPost),
    })
      .then((res) => res.json())
      .then((addedCell) => {
        setCells([...cells, addedCell]);
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

  const openEditModal = (cell: Cell) => {
    setEditingCell({ ...cell });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCell = () => {
    if (!editingCell || !editingCell.cellNumber || !editingCell.block) {
      toast({
        title: 'Error',
        description: 'Please fill in required cell details',
        variant: 'destructive',
      });
      return;
    }

    fetch(`${API_BASE_URL}/api/cells/${editingCell.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCell),
    })
      .then((res) => res.json())
      .then((updated) => {
        setCells(cells.map((c) => (c.id === editingCell.id ? updated : c)));
        setIsEditDialogOpen(false);
        setEditingCell(null);
        toast({
          title: 'Success',
          description: `Cell ${updated.cellNumber} updated successfully`,
        });
      })
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Failed to update cell',
          variant: 'destructive',
        })
      );
  };

  const handleStatusChange = (id: string, newStatus: Cell['status']) => {
    const target = cells.find((c) => c.id === id);
    if (!target) return;

    fetch(`${API_BASE_URL}/api/cells/${id}`, {
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
    <div className="space-y-6 bg-white p-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          )}
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Cells Management</h2>
            <p className="text-slate-500">Monitor and manage cell assignments</p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add New Cell
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
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
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select block" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
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
              <Button type="submit" onClick={handleAddCell} className="bg-blue-600 hover:bg-blue-700">
                Add Cell
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Cell Modal */}
      {editingCell && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Edit Cell {editingCell.cellNumber}</DialogTitle>
              <DialogDescription>
                Update the cell details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editCellNumber">Cell Number</Label>
                <Input
                  id="editCellNumber"
                  value={editingCell.cellNumber}
                  onChange={(e) =>
                    setEditingCell({ ...editingCell, cellNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editBlock">Block</Label>
                <Input
                  id="editBlock"
                  value={editingCell.block}
                  onChange={(e) =>
                    setEditingCell({ ...editingCell, block: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCapacity">Capacity</Label>
                <Input
                  id="editCapacity"
                  type="number"
                  value={editingCell.capacity}
                  onChange={(e) =>
                    setEditingCell({ ...editingCell, capacity: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select
                  value={editingCell.status}
                  onValueChange={(val: any) =>
                    setEditingCell({ ...editingCell, status: val })
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateCell} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <Input
          placeholder="Search cells..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-white"
        />
        <div className="flex gap-4 flex-wrap items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Occupied">Occupied</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={blockFilter} onValueChange={setBlockFilter}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Filter by block" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="All">All Blocks</SelectItem>
              {blockOptions.map((block) => (
                <SelectItem key={block} value={block}>
                  {block}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-slate-600 font-medium">Total: {cells.length} cells</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCells.map((cell) => (
          <Card key={cell.id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900">{cell.cellNumber}</CardTitle>
                  <CardDescription className="text-slate-500">Block {cell.block}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(cell)}
                  className="flex items-center gap-1 border-slate-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Status:</span>
                <Select
                  value={cell.status}
                  onValueChange={(value: 'Available' | 'Occupied' | 'Maintenance' | 'Closed') =>
                    handleStatusChange(cell.id, value)
                  }
                >
                  <SelectTrigger className="w-32 bg-white border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
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
                  <span className="font-semibold text-slate-800">
                    {cell.currentOccupancy}/{cell.capacity}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(100, (cell.currentOccupancy / (cell.capacity || 1)) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {cell.inmates && cell.inmates.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-slate-600">
                    Current Inmates:
                  </span>
                  <ul className="mt-1 space-y-1">
                    {cell.inmates.map((inmate, index) => (
                      <li
                        key={index}
                        className="text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 font-mono"
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
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
          <p className="text-slate-500">No cells found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default CellsPanel;
