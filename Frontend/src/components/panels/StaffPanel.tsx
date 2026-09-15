import { useEffect, useState, useCallback } from 'react';
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

interface Staff {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  department: string;
  shift: 'Day' | 'Night' | 'Rotating';
  status: 'On Duty' | 'Off Duty' | 'On Leave' | 'Training';
  hireDate: string;
  phone: string;
}

interface StaffPanelProps {
  onBack?: () => void;
}

const StaffPanel = ({ onBack }: StaffPanelProps) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [shiftFilter, setShiftFilter] = useState<string>('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [newStaff, setNewStaff] = useState({
    name: '',
    position: '',
    department: '',
    shift: 'Day' as 'Day' | 'Night' | 'Rotating',
    phone: '',
    status: 'On Duty' as 'On Duty' | 'Off Duty' | 'On Leave' | 'Training',
  });

  const fetchStaff = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/staff`);
      if (!res.ok) throw new Error('Failed to fetch staff list');
      const data = await res.json();
      setStaff(data);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Error fetching staff',
        variant: 'destructive',
      });
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      (member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (member.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (member.position?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (member.department?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
    const matchesShift = shiftFilter === 'All' || member.shift === shiftFilter;
    return matchesSearch && matchesStatus && matchesShift;
  });

  const handleAddStaff = async () => {
    if (!newStaff.name || !newStaff.position || !newStaff.department) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const payload = {
      ...newStaff,
      employeeId: `EMP${String(staff.length + 1).padStart(3, '0')}`,
      hireDate: new Date().toISOString().split('T')[0],
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create staff');
      const created = await res.json();
      setStaff([...staff, created]);
      setNewStaff({
        name: '',
        position: '',
        department: '',
        shift: 'Day',
        phone: '',
        status: 'On Duty',
      });
      setIsAddDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Staff member added successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Error adding staff',
        variant: 'destructive',
      });
    }
  };

  const openEditModal = (member: Staff) => {
    setEditingStaff({ ...member });
    setIsEditDialogOpen(true);
  };

  const handleUpdateStaff = async () => {
    if (!editingStaff || !editingStaff.name) {
      toast({
        title: 'Error',
        description: 'Please enter staff name',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/staff/${editingStaff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStaff),
      });

      if (!res.ok) throw new Error('Failed to update staff member');
      const updated = await res.json();
      setStaff(staff.map((s) => (s.id === editingStaff.id ? updated : s)));
      setIsEditDialogOpen(false);
      setEditingStaff(null);
      toast({
        title: 'Success',
        description: `Staff member ${updated.name} updated successfully`,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update staff',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/staff/${id}`, { method: 'DELETE' });
      setStaff(staff.filter((s) => s.id !== id));
      toast({
        title: 'Success',
        description: 'Staff member removed successfully',
      });
    } catch {
      setStaff(staff.filter((s) => s.id !== id));
      toast({
        title: 'Success',
        description: 'Staff member removed',
      });
    }
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
            <h2 className="text-3xl font-bold text-slate-900">Staff Management</h2>
            <p className="text-slate-500">Monitor and manage facility staff</p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add New Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Enter staff member details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="staffName">Full Name</Label>
                <Input
                  id="staffName"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="e.g. Officer Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newStaff.position}
                  onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                  placeholder="e.g. Correctional Officer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                  placeholder="e.g. Security"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift">Shift</Label>
                <Select
                  value={newStaff.shift}
                  onValueChange={(val: any) => setNewStaff({ ...newStaff, shift: val })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                    <SelectItem value="Rotating">Rotating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  placeholder="Contact phone"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddStaff} className="bg-blue-600 hover:bg-blue-700">
                Add Staff
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Staff Modal */}
      {editingStaff && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Edit Staff: {editingStaff.name}</DialogTitle>
              <DialogDescription>
                Update staff member record below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editStaffName">Full Name</Label>
                <Input
                  id="editStaffName"
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmpId">Employee ID</Label>
                <Input
                  id="editEmpId"
                  value={editingStaff.employeeId}
                  onChange={(e) => setEditingStaff({ ...editingStaff, employeeId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPosition">Position</Label>
                <Input
                  id="editPosition"
                  value={editingStaff.position}
                  onChange={(e) => setEditingStaff({ ...editingStaff, position: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDepartment">Department</Label>
                <Input
                  id="editDepartment"
                  value={editingStaff.department}
                  onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editShift">Shift</Label>
                <Select
                  value={editingStaff.shift}
                  onValueChange={(val: any) => setEditingStaff({ ...editingStaff, shift: val })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                    <SelectItem value="Rotating">Rotating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStaffStatus">Status</Label>
                <Select
                  value={editingStaff.status}
                  onValueChange={(val: any) => setEditingStaff({ ...editingStaff, status: val })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="On Duty">On Duty</SelectItem>
                    <SelectItem value="Off Duty">Off Duty</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone</Label>
                <Input
                  id="editPhone"
                  value={editingStaff.phone}
                  onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateStaff} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <Input
          placeholder="Search staff by name, position, department..."
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
              <SelectItem value="On Duty">On Duty</SelectItem>
              <SelectItem value="Off Duty">Off Duty</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
              <SelectItem value="Training">Training</SelectItem>
            </SelectContent>
          </Select>

          <Select value={shiftFilter} onValueChange={setShiftFilter}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Filter by shift" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="All">All Shifts</SelectItem>
              <SelectItem value="Day">Day</SelectItem>
              <SelectItem value="Night">Night</SelectItem>
              <SelectItem value="Rotating">Rotating</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-slate-600 font-medium">Total: {filteredStaff.length} staff</span>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredStaff.map((member) => (
          <Card key={member.id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900">{member.name}</CardTitle>
                  <CardDescription className="text-slate-500 font-mono text-xs">
                    ID: {member.employeeId} • {member.position} ({member.department})
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      member.status === 'On Duty'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : member.status === 'Off Duty'
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}
                  >
                    {member.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(member)}
                    className="flex items-center gap-1 border-slate-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteStaff(member.id)}
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
                  <span className="font-medium text-slate-500">Shift:</span>
                  <p className="font-semibold text-slate-800">{member.shift}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Hire Date:</span>
                  <p className="font-semibold text-slate-800">{member.hireDate}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Phone:</span>
                  <p className="font-semibold text-slate-800">{member.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-500">Department:</span>
                  <p className="font-semibold text-slate-800">{member.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
          <p className="text-slate-500">No staff members found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default StaffPanel;
