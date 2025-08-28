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

const InmatesPanel = () => {
  const [inmates, setInmates] = useState<Inmate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Released' | 'Transferred'>('All');
  const [blockFilter, setBlockFilter] = useState<'All' | string>('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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

  useEffect(() => {
    fetch('http://localhost:8080/api/inmates')
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

    fetch('http://localhost:8080/api/cells')
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
        .filter(cell => cell.block === newInmate.block)
        .map(cell => cell.cellNumber);
      setCellOptions(filtered);
    } else {
      setCellOptions([]);
    }
  }, [newInmate.block, cells]);

  const uniqueBlocks = Array.from(new Set(cells.map((cell) => cell.block)));

  const filteredInmates = inmates.filter((inmate) => {
    const matchesSearch =
      inmate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inmate.inmateId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inmate.status === statusFilter;
    const matchesBlock = blockFilter === 'All' || inmate.block === blockFilter;
    return matchesSearch && matchesStatus && matchesBlock;
  });

  const handleAddInmate = () => {
    if (!newInmate.name || !newInmate.age || !newInmate.cellNumber || !newInmate.charges || !newInmate.block) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const inmate: Inmate = {
      id: Date.now().toString(),
      inmateId: `INM${String(inmates.length + 1).padStart(3, '0')}`,
      name: newInmate.name,
      age: parseInt(newInmate.age),
      cellNumber: newInmate.cellNumber,
      charges: newInmate.charges,
      status: newInmate.status,
      admissionDate: new Date().toISOString().split('T')[0],
      block: newInmate.block,
    };

    setInmates([...inmates, inmate]);
    setNewInmate({ name: '', age: '', cellNumber: '', charges: '', status: 'Active', block: '' });
    setIsAddDialogOpen(false);

    toast({
      title: 'Success',
      description: 'Inmate added successfully (locally)',
    });
  };

  const handleDeleteInmate = (id: string) => {
    setInmates(inmates.filter((inmate) => inmate.id !== id));
    toast({
      title: 'Success',
      description: 'Inmate removed successfully (locally)',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Inmates Management</h2>
          <p className="text-slate-600">Manage inmate records and information</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">Add New Inmate</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Inmate</DialogTitle>
              <DialogDescription>
                Enter the inmate&apos;s information below.
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select block" />
                  </SelectTrigger>
                  <SelectContent>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select cell number" />
                  </SelectTrigger>
                  <SelectContent>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Released">Released</SelectItem>
                    <SelectItem value="Transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddInmate}>
                Add Inmate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center space-x-4">
        <Input
          placeholder="Search inmates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <Select
          value={statusFilter}
          onValueChange={(value: 'All' | 'Active' | 'Released' | 'Transferred') =>
            setStatusFilter(value)
          }
        >
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Released">Released</SelectItem>
            <SelectItem value="Transferred">Transferred</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={blockFilter}
          onValueChange={(value: string) => setBlockFilter(value)}
        >
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Filter by block" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {Array.from(new Set(inmates.map((i) => i.block))).filter(b => b).map((block) => (
              <SelectItem key={block} value={block}>
                {block}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-slate-600">Total: {filteredInmates.length} inmates</span>
      </div>

      <div className="grid gap-4">
        {filteredInmates.map((inmate) => (
          <Card key={inmate.id} className="bg-white border-slate-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{inmate.name}</CardTitle>
                  <CardDescription>
                    ID: {inmate.inmateId} • Cell: {inmate.cellNumber} • Block: {inmate.block}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inmate.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : inmate.status === 'Released'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {inmate.status}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteInmate(inmate.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-600">Age:</span>
                  <p>{inmate.age} years</p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Admission:</span>
                  <p>{inmate.admissionDate}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Charges:</span>
                  <p>{inmate.charges}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Cell:</span>
                  <p>{inmate.cellNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInmates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No inmates found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default InmatesPanel;
