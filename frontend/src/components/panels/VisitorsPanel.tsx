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

interface Visitor {
  id: string;
  name: string;
  relationship: string;
  inmateVisiting: string;
  visitDate: string;
  visitTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  phone: string;
  idNumber: string;
}

interface VisitorsPanelProps {
  onBack?: () => void;
}

const VisitorsPanel = ({ onBack }: VisitorsPanelProps) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Scheduled' | 'Completed' | 'Cancelled'>('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);

  const [newVisitor, setNewVisitor] = useState({
    name: '',
    relationship: '',
    inmateVisiting: '',
    visitDate: '',
    visitTime: '',
    phone: '',
    idNumber: '',
    status: 'Scheduled' as const,
  });

  const fetchVisitors = () => {
    fetch(`${API_BASE_URL}/api/visitors`)
      .then((res) => res.json())
      .then((data) => setVisitors(data))
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Failed to fetch visitor records',
          variant: 'destructive',
        })
      );
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      (visitor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (visitor.inmateVisiting?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (visitor.idNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'All' || visitor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddVisitor = () => {
    if (!newVisitor.name || !newVisitor.inmateVisiting || !newVisitor.visitDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const payload = {
      ...newVisitor,
      visitingInmate: newVisitor.inmateVisiting,
    };

    fetch(`${API_BASE_URL}/api/visitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((created) => {
        setVisitors([created, ...visitors]);
        setNewVisitor({
          name: '',
          relationship: '',
          inmateVisiting: '',
          visitDate: '',
          visitTime: '',
          phone: '',
          idNumber: '',
          status: 'Scheduled',
        });
        setIsAddDialogOpen(false);
        toast({
          title: 'Success',
          description: 'Visitor log created successfully',
        });
      })
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Failed to schedule visitor',
          variant: 'destructive',
        })
      );
  };

  const openEditModal = (visitor: Visitor) => {
    setEditingVisitor({ ...visitor });
    setIsEditDialogOpen(true);
  };

  const handleUpdateVisitor = () => {
    if (!editingVisitor || !editingVisitor.name) {
      toast({
        title: 'Error',
        description: 'Please enter visitor name',
        variant: 'destructive',
      });
      return;
    }

    fetch(`${API_BASE_URL}/api/visitors/${editingVisitor.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingVisitor),
    })
      .then((res) => res.json())
      .then((updated) => {
        setVisitors(visitors.map((v) => (v.id === editingVisitor.id ? updated : v)));
        setIsEditDialogOpen(false);
        setEditingVisitor(null);
        toast({
          title: 'Success',
          description: `Visitor ${updated.name} updated successfully`,
        });
      })
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Failed to update visitor record',
          variant: 'destructive',
        })
      );
  };

  const handleDeleteVisitor = (id: string) => {
    fetch(`${API_BASE_URL}/api/visitors/${id}`, { method: 'DELETE' })
      .then(() => {
        setVisitors(visitors.filter((v) => v.id !== id));
        toast({
          title: 'Success',
          description: 'Visitor record deleted',
        });
      })
      .catch(() => {
        setVisitors(visitors.filter((v) => v.id !== id));
        toast({
          title: 'Success',
          description: 'Visitor record deleted',
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
            <h2 className="text-3xl font-bold text-slate-900">Visitors Management</h2>
            <p className="text-slate-500">Log and schedule facility visitations</p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" /> Log New Visit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Log New Visitor</DialogTitle>
              <DialogDescription>
                Enter visitor registration details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="visitorName">Visitor Name</Label>
                <Input
                  id="visitorName"
                  value={newVisitor.name}
                  onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={newVisitor.relationship}
                  onChange={(e) => setNewVisitor({ ...newVisitor, relationship: e.target.value })}
                  placeholder="e.g. Spouse, Attorney, Family"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inmateVisiting">Inmate ID / Name</Label>
                <Input
                  id="inmateVisiting"
                  value={newVisitor.inmateVisiting}
                  onChange={(e) => setNewVisitor({ ...newVisitor, inmateVisiting: e.target.value })}
                  placeholder="e.g. INM001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitDate">Visit Date</Label>
                <Input
                  id="visitDate"
                  type="date"
                  value={newVisitor.visitDate}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitTime">Visit Time</Label>
                <Input
                  id="visitTime"
                  value={newVisitor.visitTime}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitTime: e.target.value })}
                  placeholder="e.g. 10:30 AM"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newVisitor.phone}
                  onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                  placeholder="Contact phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber">Govt ID Number</Label>
                <Input
                  id="idNumber"
                  value={newVisitor.idNumber}
                  onChange={(e) => setNewVisitor({ ...newVisitor, idNumber: e.target.value })}
                  placeholder="ID document number"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddVisitor} className="bg-blue-600 hover:bg-blue-700">
                Log Visit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Visitor Modal */}
      {editingVisitor && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Edit Visitor: {editingVisitor.name}</DialogTitle>
              <DialogDescription>
                Update visitor record details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editVisitorName">Visitor Name</Label>
                <Input
                  id="editVisitorName"
                  value={editingVisitor.name}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRelationship">Relationship</Label>
                <Input
                  id="editRelationship"
                  value={editingVisitor.relationship}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, relationship: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editInmate">Visiting Inmate</Label>
                <Input
                  id="editInmate"
                  value={editingVisitor.inmateVisiting}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, inmateVisiting: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDate">Visit Date</Label>
                <Input
                  id="editDate"
                  type="date"
                  value={editingVisitor.visitDate}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, visitDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTime">Visit Time</Label>
                <Input
                  id="editTime"
                  value={editingVisitor.visitTime}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, visitTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editVisitorStatus">Status</Label>
                <Select
                  value={editingVisitor.status}
                  onValueChange={(val: any) => setEditingVisitor({ ...editingVisitor, status: val })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editVisitorPhone">Phone</Label>
                <Input
                  id="editVisitorPhone"
                  value={editingVisitor.phone}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, phone: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateVisitor} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <Input
          placeholder="Search visitor, inmate, ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-white"
        />
        <div className="flex gap-4 flex-wrap items-center">
          <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-slate-600 font-medium">Total: {filteredVisitors.length} visitors</span>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredVisitors.map((visitor) => (
          <Card key={visitor.id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900">{visitor.name}</CardTitle>
                  <CardDescription className="text-slate-500 font-mono text-xs">
                    Visiting Inmate: {visitor.inmateVisiting} ({visitor.relationship})
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      visitor.status === 'Completed'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : visitor.status === 'Scheduled'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    {visitor.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(visitor)}
                    className="flex items-center gap-1 border-slate-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteVisitor(visitor.id)}
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
                  <span className="font-medium text-slate-500">Visit Date:</span>
                  <p className="font-semibold text-slate-800">{visitor.visitDate}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Visit Time:</span>
                  <p className="font-semibold text-slate-800">{visitor.visitTime || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Phone:</span>
                  <p className="font-semibold text-slate-800">{visitor.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Govt ID:</span>
                  <p className="font-semibold text-slate-800">{visitor.idNumber || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVisitors.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
          <p className="text-slate-500">No visitors found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default VisitorsPanel;
