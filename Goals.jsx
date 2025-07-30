import { useState, useEffect } from 'react'
import { 
  Plus, 
  Target, 
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function Goals() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    target_amount: '',
    current_amount: '',
    target_date: ''
  })

  // Dados mockados para demonstração
  const mockGoals = [
    {
      id: 1,
      name: "Viagem para Europa",
      description: "Viagem de 15 dias para Europa com a família",
      target_amount: 8000.00,
      current_amount: 2400.00,
      target_date: "2025-09-15",
      progress_percentage: 30.0,
      months_remaining: 8.5,
      monthly_savings_needed: 658.82,
      is_achievable: true,
      avg_monthly_savings_capacity: 2500.00
    },
    {
      id: 2,
      name: "Reserva de Emergência",
      description: "Reserva equivalente a 6 meses de gastos",
      target_amount: 15000.00,
      current_amount: 5500.00,
      target_date: "2026-01-31",
      progress_percentage: 36.7,
      months_remaining: 12.0,
      monthly_savings_needed: 791.67,
      is_achievable: false,
      avg_monthly_savings_capacity: 2500.00
    },
    {
      id: 3,
      name: "Novo Carro",
      description: "Entrada para financiamento de carro novo",
      target_amount: 25000.00,
      current_amount: 8500.00,
      target_date: "2025-12-31",
      progress_percentage: 34.0,
      months_remaining: 11.2,
      monthly_savings_needed: 1473.21,
      is_achievable: true,
      avg_monthly_savings_capacity: 2500.00
    },
    {
      id: 4,
      name: "Curso de MBA",
      description: "MBA em Gestão Financeira",
      target_amount: 12000.00,
      current_amount: 12000.00,
      target_date: "2025-03-01",
      progress_percentage: 100.0,
      months_remaining: 0,
      monthly_savings_needed: 0,
      is_achievable: true,
      avg_monthly_savings_capacity: 2500.00
    }
  ]

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setGoals(mockGoals)
      setLoading(false)
    }, 1000)
  }, [])

  const handleAddGoal = () => {
    const goal = {
      id: Date.now(),
      ...newGoal,
      target_amount: parseFloat(newGoal.target_amount),
      current_amount: parseFloat(newGoal.current_amount || 0),
      progress_percentage: (parseFloat(newGoal.current_amount || 0) / parseFloat(newGoal.target_amount)) * 100,
      months_remaining: calculateMonthsRemaining(newGoal.target_date),
      monthly_savings_needed: calculateMonthlySavingsNeeded(newGoal),
      is_achievable: true,
      avg_monthly_savings_capacity: 2500.00
    }
    
    setGoals([...goals, goal])
    setIsAddDialogOpen(false)
    resetNewGoal()
  }

  const handleUpdateGoal = () => {
    const updatedGoal = {
      ...editingGoal,
      ...newGoal,
      target_amount: parseFloat(newGoal.target_amount),
      current_amount: parseFloat(newGoal.current_amount || 0),
      progress_percentage: (parseFloat(newGoal.current_amount || 0) / parseFloat(newGoal.target_amount)) * 100,
      months_remaining: calculateMonthsRemaining(newGoal.target_date),
      monthly_savings_needed: calculateMonthlySavingsNeeded(newGoal)
    }
    
    setGoals(goals.map(goal => goal.id === editingGoal.id ? updatedGoal : goal))
    setEditingGoal(null)
    resetNewGoal()
  }

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId))
  }

  const handleEditGoal = (goal) => {
    setEditingGoal(goal)
    setNewGoal({
      name: goal.name,
      description: goal.description,
      target_amount: goal.target_amount.toString(),
      current_amount: goal.current_amount.toString(),
      target_date: goal.target_date
    })
  }

  const resetNewGoal = () => {
    setNewGoal({
      name: '',
      description: '',
      target_amount: '',
      current_amount: '',
      target_date: ''
    })
  }

  const calculateMonthsRemaining = (targetDate) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target - today
    const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44)
    return Math.max(0, diffMonths)
  }

  const calculateMonthlySavingsNeeded = (goalData) => {
    const remaining = parseFloat(goalData.target_amount) - parseFloat(goalData.current_amount || 0)
    const months = calculateMonthsRemaining(goalData.target_date)
    return months > 0 ? remaining / months : 0
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (goal) => {
    if (goal.progress_percentage >= 100) return 'text-green-600'
    if (goal.is_achievable) return 'text-blue-600'
    return 'text-red-600'
  }

  const getStatusBadge = (goal) => {
    if (goal.progress_percentage >= 100) {
      return <Badge className="bg-green-100 text-green-800">Concluída</Badge>
    }
    if (goal.is_achievable) {
      return <Badge className="bg-blue-100 text-blue-800">No prazo</Badge>
    }
    return <Badge className="bg-red-100 text-red-800">Desafiadora</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Metas Financeiras</h1>
          <p className="text-gray-600">Defina e acompanhe seus objetivos de economia</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Meta</DialogTitle>
              <DialogDescription>
                Defina um novo objetivo financeiro
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Meta</Label>
                <Input
                  id="name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  placeholder="Ex: Viagem, Carro, Reserva..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder="Descreva sua meta..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="target_amount">Valor Objetivo</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    step="0.01"
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal({...newGoal, target_amount: e.target.value})}
                    placeholder="0,00"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="current_amount">Valor Atual</Label>
                  <Input
                    id="current_amount"
                    type="number"
                    step="0.01"
                    value={newGoal.current_amount}
                    onChange={(e) => setNewGoal({...newGoal, current_amount: e.target.value})}
                    placeholder="0,00"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="target_date">Data Objetivo</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddGoal}>
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo das Metas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Metas</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {goals.filter(goal => goal.progress_percentage >= 100).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Objetivos</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(goals.reduce((sum, goal) => sum + goal.target_amount, 0))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Já Poupado</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(goals.reduce((sum, goal) => sum + goal.current_amount, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2">
                    <span>{goal.name}</span>
                    {getStatusBadge(goal)}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {goal.description}
                  </CardDescription>
                </div>
                
                <div className="flex space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditGoal(goal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Editar Meta</DialogTitle>
                        <DialogDescription>
                          Atualize os dados da sua meta
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit_name">Nome da Meta</Label>
                          <Input
                            id="edit_name"
                            value={newGoal.name}
                            onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="edit_description">Descrição</Label>
                          <Textarea
                            id="edit_description"
                            value={newGoal.description}
                            onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit_target_amount">Valor Objetivo</Label>
                            <Input
                              id="edit_target_amount"
                              type="number"
                              step="0.01"
                              value={newGoal.target_amount}
                              onChange={(e) => setNewGoal({...newGoal, target_amount: e.target.value})}
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="edit_current_amount">Valor Atual</Label>
                            <Input
                              id="edit_current_amount"
                              type="number"
                              step="0.01"
                              value={newGoal.current_amount}
                              onChange={(e) => setNewGoal({...newGoal, current_amount: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="edit_target_date">Data Objetivo</Label>
                          <Input
                            id="edit_target_date"
                            type="date"
                            value={newGoal.target_date}
                            onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setEditingGoal(null)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleUpdateGoal}>
                          Salvar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progresso */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span className={`font-medium ${getStatusColor(goal)}`}>
                    {goal.progress_percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={Math.min(goal.progress_percentage, 100)} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatCurrency(goal.current_amount)}</span>
                  <span>{formatCurrency(goal.target_amount)}</span>
                </div>
              </div>

              {/* Informações */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>Data objetivo</span>
                  </div>
                  <div className="font-medium">{formatDate(goal.target_date)}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-gray-600">
                    <Target className="mr-1 h-3 w-3" />
                    <span>Tempo restante</span>
                  </div>
                  <div className="font-medium">
                    {goal.months_remaining > 0 ? `${goal.months_remaining.toFixed(1)} meses` : 'Concluída'}
                  </div>
                </div>
              </div>

              {/* Necessidade de Poupança */}
              {goal.progress_percentage < 100 && goal.months_remaining > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Necessário poupar por mês:</span>
                    <span className={`font-bold ${goal.is_achievable ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(goal.monthly_savings_needed)}
                    </span>
                  </div>
                  {!goal.is_achievable && (
                    <div className="flex items-center mt-2 text-xs text-red-600">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      <span>Valor acima da capacidade de poupança atual</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {goals.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma meta definida</h3>
            <p className="text-gray-500 mb-4">
              Comece definindo seus objetivos financeiros para acompanhar seu progresso
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeira meta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

