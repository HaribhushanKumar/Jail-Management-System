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

const VisitorsPanel = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Scheduled' | 'Completed' | 'Cancelled'>('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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

  useEffect(() => {
    fetch("http://localhost:8080/api/visitors")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((v: any) => ({
          id: v._id,
          name: v.name,
          relationship: v.relationship,
          inmateVisiting: v.visitingInmate,
          visitDate: v.visitDate,
          visitTime: v.visitTime,
          status: v.status,
          phone: v.phone,
          idNumber: v.idNumber,
        }));
        setVisitors(formatted);
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to fetch visitors.',
          variant: 'destructive',
        });
      });
  }, []);

  const filteredVisitors = visitors.filter(visitor =>
    (searchTerm === '' ||
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.inmateVisiting.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'All' || visitor.status === statusFilter)
  );

const handleAddVisitor = async () => {
  if (
    !newVisitor.name ||
    !newVisitor.relationship ||
    !newVisitor.inmateVisiting ||
    !newVisitor.visitDate ||
    !newVisitor.visitTime ||
    !newVisitor.phone ||
    !newVisitor.idNumber
  ) {
    toast({
      title: 'Error',
      description: 'Please fill in all required fields',
      variant: 'destructive',
    });
    return;
  }

  const inmateExists = await checkInmateExists(newVisitor.inmateVisiting);
  if (!inmateExists) {
    toast({
      title: 'Error',
      description: 'The specified inmate does not exist.',
      variant: 'destructive',
    });
    return;
  }

  const visitorPayload = {
    name: newVisitor.name,
    relationship: newVisitor.relationship,
    visitingInmate: newVisitor.inmateVisiting,
    visitDate: newVisitor.visitDate,
    visitTime: newVisitor.visitTime,
    phone: newVisitor.phone,
    idNumber: newVisitor.idNumber,
    status: newVisitor.status,
  };

fetch("http://localhost:8080/api/visitors", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(visitorPayload),
})
  .then(async (res) => {
    if (!res.ok) {
      const errorMessage = await res.text()
      throw new Error(errorMessage || 'Failed to create visitor');
    }
    return res.json();
  })
  .then((created) => {
    setVisitors([
      ...visitors,
      {
        id: created._id,
        name: created.name,
        relationship: created.relationship,
        inmateVisiting: created.visitingInmate,
        visitDate: created.visitDate,
        visitTime: created.visitTime,
        status: created.status,
        phone: created.phone,
        idNumber: created.idNumber,
      },
    ]);
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
      description: 'Visitor scheduled successfully',
    });
  })
  .catch((err) => {
    toast({
      title: 'Error',
      description: err.message || 'An unexpected error occurred',
      variant: 'destructive',
    });
  });

};


  // const handleDeleteVisitor = (id: string) => {
  //   fetch(`http://localhost:8080/api/visitors/${id}`, {
  //     method: 'DELETE',
  //   }).then(() => {
  //     setVisitors(visitors.filter((v) => v.id !== id));
  //     toast({
  //       title: 'Success',
  //       description: 'Visitor record removed successfully',
  //     });
  //   });
  // };

  const checkInmateExists = async (inmateName: string) => {
    const res = await fetch(`http://localhost:8080/api/inmates?name=${encodeURIComponent(inmateName)}`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.length > 0;
  };

  const handleStatusChange = (
    id: string,
    newStatus: 'Scheduled' | 'Completed' | 'Cancelled'
  ) => {
    const updatedVisitor = visitors.find((v) => v.id === id);
    if (!updatedVisitor) return;

    const updated = {
      ...updatedVisitor,
      status: newStatus,
      visitingInmate: updatedVisitor.inmateVisiting,
    };

    fetch(`http://localhost:8080/api/visitors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then(() => {
        setVisitors(
          visitors.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
        );
        toast({
          title: 'Success',
          description: `Visit status updated to ${newStatus}`,
        });
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Visitors Management</h2>
          <p className="text-slate-600">Schedule and manage inmate visits</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Schedule Visit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Visit</DialogTitle>
              <DialogDescription>
                Enter visitor and visit information below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Visitor Name</Label>
                  <Input
                    id="name"
                    value={newVisitor.name}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, name: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={newVisitor.relationship}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, relationship: e.target.value })
                    }
                    placeholder="e.g., Mother, Friend"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inmateVisiting">Inmate to Visit</Label>
                <Input
                  id="inmateVisiting"
                  value={newVisitor.inmateVisiting}
                  onChange={(e) =>
                    setNewVisitor({ ...newVisitor, inmateVisiting: e.target.value })
                  }
                  placeholder="e.g., John Doe (INM001)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visitDate">Visit Date</Label>
                  <Input
                    id="visitDate"
                    type="date"
                    value={newVisitor.visitDate}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, visitDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitTime">Visit Time</Label>
                  <Input
                    id="visitTime"
                    type="time"
                    value={newVisitor.visitTime}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, visitTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newVisitor.phone}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, phone: e.target.value })
                    }
                    placeholder="(+91) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input
                    id="idNumber"
                    value={newVisitor.idNumber}
                    onChange={(e) =>
                      setNewVisitor({ ...newVisitor, idNumber: e.target.value })
                    }
                    placeholder="Driver's License or ID"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddVisitor}>
                Schedule Visit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center gap-4 flex-wrap">
        <Input
          placeholder="Search visitors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-slate-600">Total: {filteredVisitors.length} visits</span>
      </div>

      <div className="grid gap-4">
        {filteredVisitors.map((visitor) => (
          <Card key={visitor.id} className="bg-white border-slate-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{visitor.name}</CardTitle>
                  <CardDescription>
                    Visiting: {visitor.inmateVisiting}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select
                    value={visitor.status}
                    onValueChange={(value) =>
                      handleStatusChange(
                        visitor.id,
                        value as 'Scheduled' | 'Completed' | 'Cancelled'
                      )
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteVisitor(visitor.id)}
                  >
                    Delete
                  </Button> */}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-600">Relationship:</span>
                  <p>{visitor.relationship}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Date & Time:</span>
                  <p>
                    {visitor.visitDate} at {visitor.visitTime}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Phone:</span>
                  <p>{visitor.phone}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">ID Number:</span>
                  <p>{visitor.idNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVisitors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">
            No visits found matching your search or filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default VisitorsPanel;
