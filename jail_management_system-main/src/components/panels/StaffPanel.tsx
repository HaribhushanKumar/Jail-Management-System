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

const StaffPanel = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [shiftFilter, setShiftFilter] = useState<string>('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
      const res = await fetch('http://localhost:8080/api/staff');
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to fetch staff data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || member.status === statusFilter;

    const matchesShift = shiftFilter === 'All' || member.shift === shiftFilter;

    return matchesSearch && matchesStatus && matchesShift;
  });

const handleAddStaff = async () => {
  if (
    !newStaff.name ||
    !newStaff.position ||
    !newStaff.department ||
    !newStaff.phone
  ) {
    toast({
      title: 'Error',
      description: 'Please fill in all required fields',
      variant: 'destructive',
    });
    return;
  }

  const staffMember = {
    name: newStaff.name,
    position: newStaff.position,
    department: newStaff.department,
    shift: newStaff.shift,
    phone: newStaff.phone,
    status: newStaff.status,
    hireDate: new Date().toISOString().split('T')[0],
  };

  try {
    const res = await fetch('http://localhost:8080/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffMember),
    });

    const savedStaff = await res.json();
    setStaff([...staff, savedStaff]);
    toast({ title: 'Success', description: 'Staff member added successfully' });

    // Reset form and close dialog
    setNewStaff({
      name: '',
      position: '',
      department: '',
      shift: 'Day',
      phone: '',
      status: 'On Duty',
    });
    setIsAddDialogOpen(false);
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to add staff', variant: 'destructive' });
  }
};


const handleDeleteStaff = async (id: string) => {
  try {
    await fetch(`http://localhost:8080/api/staff/${id}`, {
      method: 'DELETE',
    });
    setStaff(staff.filter((member) => member.id !== id));
    toast({ title: 'Success', description: 'Staff member removed successfully' });
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to delete staff', variant: 'destructive' });
  }
};


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Staff Management</h2>
          <p className="text-slate-600">Manage staff members and assignments</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">Add New Staff</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>Enter the staff member's information below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newStaff.position}
                  onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                  placeholder="e.g., Security Officer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                  placeholder="e.g., Security"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift">Shift</Label>
                <Select
                  value={newStaff.shift}
                  onValueChange={(value: 'Day' | 'Night' | 'Rotating') =>
                    setNewStaff({ ...newStaff, shift: value })
                  }
                >
                  <SelectTrigger><SelectValue placeholder="Select shift" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                    <SelectItem value="Rotating">Rotating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newStaff.status}
                  onValueChange={(value: 'On Duty' | 'Off Duty' | 'On Leave' | 'Training') =>
                    setNewStaff({ ...newStaff, status: value })
                  }
                >
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On Duty">On Duty</SelectItem>
                    <SelectItem value="Off Duty">Off Duty</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  placeholder="(+91) 123-4567"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddStaff}>
                Add Staff Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <Input
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="status">Status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="On Duty">On Duty</SelectItem>
                <SelectItem value="Off Duty">Off Duty</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="shift">Shift:</Label>
            <Select value={shiftFilter} onValueChange={setShiftFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Day">Day</SelectItem>
                <SelectItem value="Night">Night</SelectItem>
                <SelectItem value="Rotating">Rotating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <span className="text-slate-600">Total: {filteredStaff.length} staff members</span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading staff data...</div>
      ) : filteredStaff.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No staff members found.</div>
      ) : (
        <div className="grid gap-4">
          {filteredStaff.map((member) => (
            <Card key={member.id} className="bg-white border-slate-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>
                      {member.position} • {member.department}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'On Duty'
                          ? 'bg-green-100 text-green-800'
                          : member.status === 'On Leave'
                          ? 'bg-yellow-100 text-yellow-800'
                          : member.status === 'Training'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {member.status}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteStaff(member.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-slate-600">Employee ID:</span>
                    <p>{member.employeeId}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Shift:</span>
                    <p>{member.shift}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Hire Date:</span>
                    <p>{member.hireDate}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Phone:</span>
                    <p>{member.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffPanel;
