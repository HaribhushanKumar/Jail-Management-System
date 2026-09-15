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
import { ArrowLeft, Edit3, Trash2, Plus } from 'lucide-react';
import { API_BASE_URL } from '@/config/apiConfig';

interface Inmate {
  id: string;
  name: string;
  inmateId: string;
  age: number;
  cellNumber: string;
  admissionDate: string;
  status: 'Active' | 'Released' | 'Transferred';
  charges: string;
  block: string;
}

interface Cell {
  cellNumber: string;
  block: string;
  capacity: number;
  currentOccupancy: number;
  status: string;
}

interface InmatesPanelProps {
  onBack?: () => void;
}

const InmatesPanel = ({ onBack }: InmatesPanelProps) => {
  const [inmates, setInmates] = useState<Inmate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Released' | 'Transferred'>('All');
  const [blockFilter, setBlockFilter] = useState<'All' | string>('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingInmate, setEditingInmate] = useState<Inmate | null>(null);

  const [cells, setCells] = useState<Cell[]>([]);
  const [cellOptions, setCellOptions] = useState<string[]>([]);
  const [newInmate, setNewInmate] = useState({
    name: '',
    age: '',
    cellNumber: '',
    charges: '',
    status: 'Active' as 'Active' | 'Released' | 'Transferred',
    block: '',
  });

  const fetchInmates = () => {
    fetch(`${API_BASE_URL}/api/inmates`)
      .then((res) => res.json())
      .then((data) => setInmates(data))
      .catch((err) => {
        console.error('Error fetching inmates:', err);
        toast({
          title: 'Error',
          description: 'Failed to fetch inmate data.',
          variant: 'destructive',
        });
      });
  };

  useEffect(() => {
    fetchInmates();

    fetch(`${API_BASE_URL}/api/cells`)
      .then((res) => res.json())
      .then((data) => {
        const availableCells = data.filter(
          (cell: Cell) => cell.status === 'Available' && cell.currentOccupancy < cell.capacity
        );
        setCells(availableCells);
      })
      .catch((err) => {
        console.error('Error fetching cells:', err);
        toast({
          title: 'Error',
          description: 'Failed to fetch cell data.',
          variant: 'destructive',
        });
      });
  }, []);

  useEffect(() => {
    if (newInmate.block) {
      const filtered = cells
        .filter((cell) => cell.block === newInmate.block)
        .map((cell) => cell.cellNumber);
      setCellOptions(filtered);
    } else {
      setCellOptions([]);
    }
  }, [newInmate.block, cells]);

  const uniqueBlocks = Array.from(new Set(cells.map((cell) => cell.block)));

  const filteredInmates = inmates.filter((inmate) => {
    const matchesSearch =
      (inmate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (inmate.inmateId?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'All' || inmate.status === statusFilter;
    const matchesBlock = blockFilter === 'All' || inmate.block === blockFilter;
    return matchesSearch && matchesStatus && matchesBlock;
  });

  const handleAddInmate = () => {
    if (!newInmate.name || !newInmate.age || !newInmate.charges) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const inmateToPost = {
      name: newInmate.name,
      inmateId: `INM${String(inmates.length + 1).padStart(3, '0')}`,
      age: parseInt(newInmate.age),
      cellNumber: newInmate.cellNumber || 'Unassigned',
      charges: newInmate.charges,
      status: newInmate.status,
      admissionDate: new Date().toISOString().split('T')[0],
      block: newInmate.block || 'General',
    };

    fetch(`${API_BASE_URL}/api/inmates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inmateToPost),
    })
      .then((res) => res.json())
      .then((created) => {
        setInmates([created, ...inmates]);
        setNewInmate({ name: '', age: '', cellNumber: '', charges: '', status: 'Active', block: '' });
        setIsAddDialogOpen(false);
        toast({
          title: 'Success',
          description: 'Inmate added successfully',
        });
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to add inmate',
          variant: 'destructive',
        });
      });
  };

  const openEditModal = (inmate: Inmate) => {
    setEditingInmate({ ...inmate });
    setIsEditDialogOpen(true);
  };

  const handleUpdateInmate = () => {
    if (!editingInmate || !editingInmate.name) {
      toast({
        title: 'Error',
        description: 'Please enter a valid inmate name',
        variant: 'destructive',
      });
      return;
    }

    fetch(`${API_BASE_URL}/api/inmates/${editingInmate.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingInmate),
    })
      .then((res) => res.json())
      .then((updated) => {
        setInmates(inmates.map((i) => (i.id === editingInmate.id ? updated : i)));
        setIsEditDialogOpen(false);
        setEditingInmate(null);
        toast({
          title: 'Success',
          description: `Inmate ${updated.name} updated successfully`,
        });
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to update inmate details',
          variant: 'destructive',
        });
      });
  };

  const handleDeleteInmate = (id: string) => {
    fetch(`${API_BASE_URL}/api/inmates/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setInmates(inmates.filter((inmate) => inmate.id !== id));
        toast({
          title: 'Success',
          description: 'Inmate removed successfully',
        });
      })
      .catch(() => {
        setInmates(inmates.filter((inmate) => inmate.id !== id));
        toast({
          title: 'Success',
          description: 'Inmate removed from view',
        });
      });
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
            <h2 className="text-3xl font-bold text-slate-900">Inmates Management</h2>
            <p className="text-slate-500">Manage inmate records and details</p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add New Inmate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Inmate</DialogTitle>
              <DialogDescription>
                Enter the inmate's information below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newInmate.name}
                  onChange={(e) => setNewInmate({ ...newInmate, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={newInmate.age}
                  onChange={(e) => setNewInmate({ ...newInmate, age: e.target.value })}
                  placeholder="Enter age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="block">Block</Label>
                <Select
                  value={newInmate.block}
                  onValueChange={(value) => setNewInmate({ ...newInmate, block: value, cellNumber: '' })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select block" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {uniqueBlocks.map((block) => (
                      <SelectItem key={block} value={block}>
                        {block}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cellNumber">Cell Number</Label>
                <Select
                  value={newInmate.cellNumber}
                  onValueChange={(value) => setNewInmate({ ...newInmate, cellNumber: value })}
                  disabled={!newInmate.block}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select cell number" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {cellOptions.map((cellNum) => (
                      <SelectItem key={cellNum} value={cellNum}>
                        {cellNum}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="charges">Charges</Label>
                <Input
                  id="charges"
                  value={newInmate.charges}
                  onChange={(e) => setNewInmate({ ...newInmate, charges: e.target.value })}
                  placeholder="Enter charges"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newInmate.status}
                  onValueChange={(value: 'Active' | 'Released' | 'Transferred') =>
                    setNewInmate({ ...newInmate, status: value })
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Released">Released</SelectItem>
                    <SelectItem value="Transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddInmate} className="bg-blue-600 hover:bg-blue-700">
                Add Inmate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Inmate Modal */}
      {editingInmate && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Edit Inmate: {editingInmate.name}</DialogTitle>
              <DialogDescription>
                Update inmate details and records below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Full Name</Label>
                <Input
                  id="editName"
                  value={editingInmate.name}
                  onChange={(e) => setEditingInmate({ ...editingInmate, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editInmateId">Inmate ID</Label>
                <Input
                  id="editInmateId"
                  value={editingInmate.inmateId}
                  onChange={(e) => setEditingInmate({ ...editingInmate, inmateId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAge">Age</Label>
                <Input
                  id="editAge"
                  type="number"
                  value={editingInmate.age}
                  onChange={(e) => setEditingInmate({ ...editingInmate, age: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editBlock">Block</Label>
                <Input
                  id="editBlock"
                  value={editingInmate.block}
                  onChange={(e) => setEditingInmate({ ...editingInmate, block: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCellNumber">Cell Number</Label>
                <Input
                  id="editCellNumber"
                  value={editingInmate.cellNumber}
                  onChange={(e) => setEditingInmate({ ...editingInmate, cellNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCharges">Charges</Label>
                <Input
                  id="editCharges"
                  value={editingInmate.charges}
                  onChange={(e) => setEditingInmate({ ...editingInmate, charges: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select
                  value={editingInmate.status}
                  onValueChange={(val: 'Active' | 'Released' | 'Transferred') =>
                    setEditingInmate({ ...editingInmate, status: val })
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Released">Released</SelectItem>
                    <SelectItem value="Transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateInmate} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <Input
          placeholder="Search inmates by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-white"
        />

        <div className="flex gap-4 flex-wrap items-center">
          <Select
            value={statusFilter}
            onValueChange={(value: 'All' | 'Active' | 'Released' | 'Transferred') =>
              setStatusFilter(value)
            }
          >
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Released">Released</SelectItem>
              <SelectItem value="Transferred">Transferred</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={blockFilter}
            onValueChange={(value: string) => setBlockFilter(value)}
          >
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Filter by block" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="All">All Blocks</SelectItem>
              {Array.from(new Set(inmates.map((i) => i.block))).filter(Boolean).map((block) => (
                <SelectItem key={block} value={block}>
                  {block}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-slate-600 font-medium">Total: {filteredInmates.length} inmates</span>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredInmates.map((inmate) => (
          <Card key={inmate.id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900">{inmate.name}</CardTitle>
                  <CardDescription className="text-slate-500 font-mono text-xs">
                    ID: {inmate.inmateId} • Cell: {inmate.cellNumber} • Block: {inmate.block}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      inmate.status === 'Active'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : inmate.status === 'Released'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-orange-100 text-orange-800 border border-orange-200'
                    }`}
                  >
                    {inmate.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(inmate)}
                    className="flex items-center gap-1 border-slate-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteInmate(inmate.id)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-500">Age:</span>
                  <p className="font-semibold text-slate-800">{inmate.age} years</p>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Admission Date:</span>
                  <p className="font-semibold text-slate-800">{inmate.admissionDate}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Charges:</span>
                  <p className="font-semibold text-slate-800">{inmate.charges}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Assigned Cell:</span>
                  <p className="font-semibold text-slate-800">{inmate.cellNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInmates.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
          <p className="text-slate-500">No inmates found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default InmatesPanel;
