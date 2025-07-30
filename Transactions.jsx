import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Building
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    transaction_type: 'expense',
    transaction_date: new Date().toISOString().split('T')[0],
    category_id: '',
    account_id: '',
    notes: ''
  })

  // Dados mockados para demonstração
  const mockTransactions = [
    {
      id: 1,
      description: "Supermercado Extra",
      amount: 245.80,
      transaction_type: "expense",
      transaction_date: "2025-01-25",
      category: { id: 1, name: "Alimentação", color: "#28a745" },
      account: { id: 1, name: "Conta Corrente Principal", type: "checking" },
      notes: "Compras da semana"
    },
    {
      id: 2,
      description: "Salário Janeiro",
      amount: 5500.00,
      transaction_type: "income",
      transaction_date: "2025-01-05",
      category: { id: 7, name: "Salário", color: "#198754" },
      account: { id: 1, name: "Conta Corrente Principal", type: "checking" },
      notes: ""
    },
    {
      id: 3,
      description: "Uber",
      amount: 25.50,
      transaction_type: "expense",
      transaction_date: "2025-01-24",
      category: { id: 2, name: "Transporte", color: "#007bff" },
      account: { id: 2, name: "Cartão de Crédito Visa", type: "credit_card" },
      notes: "Ida ao trabalho"
    },
    {
      id: 4,
      description: "Netflix",
      amount: 32.90,
      transaction_type: "expense",
      transaction_date: "2025-01-20",
      category: { id: 4, name: "Lazer", color: "#fd7e14" },
      account: { id: 2, name: "Cartão de Crédito Visa", type: "credit_card" },
      notes: "Assinatura mensal"
    },
    {
      id: 5,
      description: "Freelance Design",
      amount: 800.00,
      transaction_type: "income",
      transaction_date: "2025-01-15",
      category: { id: 8, name: "Freelance", color: "#0dcaf0" },
      account: { id: 1, name: "Conta Corrente Principal", type: "checking" },
      notes: "Projeto logo empresa"
    }
  ]

  const mockCategories = [
    { id: 1, name: "Alimentação" },
    { id: 2, name: "Transporte" },
    { id: 3, name: "Moradia" },
    { id: 4, name: "Lazer" },
    { id: 5, name: "Saúde" },
    { id: 6, name: "Educação" },
    { id: 7, name: "Salário" },
    { id: 8, name: "Freelance" }
  ]

  const mockAccounts = [
    { id: 1, name: "Conta Corrente Principal", account_type: "checking" },
    { id: 2, name: "Cartão de Crédito Visa", account_type: "credit_card" }
  ]

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setTransactions(mockTransactions)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || transaction.category.id.toString() === selectedCategory
    const matchesType = selectedType === 'all' || transaction.transaction_type === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  const handleAddTransaction = () => {
    // Aqui seria feita a chamada para a API
    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      category: mockCategories.find(c => c.id.toString() === newTransaction.category_id),
      account: mockAccounts.find(a => a.id.toString() === newTransaction.account_id)
    }
    
    setTransactions([transaction, ...transactions])
    setIsAddDialogOpen(false)
    setNewTransaction({
      description: '',
      amount: '',
      transaction_type: 'expense',
      transaction_date: new Date().toISOString().split('T')[0],
      category_id: '',
      account_id: '',
      notes: ''
    })
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
          <h1 className="text-3xl font-bold text-gray-900">Transações</h1>
          <p className="text-gray-600">Gerencie todas as suas transações financeiras</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Transação</DialogTitle>
                <DialogDescription>
                  Preencha os dados da nova transação
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    placeholder="Ex: Supermercado, Salário..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Valor</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                      placeholder="0,00"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={newTransaction.transaction_type} onValueChange={(value) => setNewTransaction({...newTransaction, transaction_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Despesa</SelectItem>
                        <SelectItem value="income">Receita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newTransaction.transaction_date}
                    onChange={(e) => setNewTransaction({...newTransaction, transaction_date: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={newTransaction.category_id} onValueChange={(value) => setNewTransaction({...newTransaction, category_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="account">Conta</Label>
                    <Select value={newTransaction.account_id} onValueChange={(value) => setNewTransaction({...newTransaction, account_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id.toString()}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={newTransaction.notes}
                    onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
                    placeholder="Observações opcionais..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddTransaction}>
                  Adicionar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {mockCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${transaction.transaction_type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {transaction.transaction_type === 'income' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{transaction.description}</h4>
                      <Badge 
                        variant="secondary" 
                        style={{ backgroundColor: `${transaction.category.color}20`, color: transaction.category.color }}
                      >
                        {transaction.category.name}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(transaction.transaction_date)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {transaction.account.type === 'credit_card' ? (
                          <CreditCard className="h-3 w-3" />
                        ) : (
                          <Building className="h-3 w-3" />
                        )}
                        <span>{transaction.account.name}</span>
                      </div>
                      
                      {transaction.notes && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {transaction.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-semibold ${transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.transaction_type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhuma transação encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

