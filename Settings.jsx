import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2,
  Settings as SettingsIcon,
  CreditCard,
  Tag,
  DollarSign,
  Building,
  Palette,
  Save
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export function Settings() {
  const [categories, setCategories] = useState([])
  const [accounts, setAccounts] = useState([])
  const [spendingLimits, setSpendingLimits] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estados para diálogos
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false)
  
  // Estados para edição
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingAccount, setEditingAccount] = useState(null)
  const [editingLimit, setEditingLimit] = useState(null)
  
  // Estados para novos itens
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#007bff'
  })
  
  const [newAccount, setNewAccount] = useState({
    name: '',
    account_type: 'checking',
    bank_name: '',
    balance: '',
    credit_limit: ''
  })
  
  const [newLimit, setNewLimit] = useState({
    category_id: '',
    monthly_limit: ''
  })

  // Dados mockados
  const mockCategories = [
    { id: 1, name: "Alimentação", description: "Supermercado, restaurantes, delivery", color: "#28a745", is_default: true },
    { id: 2, name: "Transporte", description: "Combustível, transporte público, Uber", color: "#007bff", is_default: true },
    { id: 3, name: "Moradia", description: "Aluguel, condomínio, IPTU", color: "#6f42c1", is_default: true },
    { id: 4, name: "Lazer", description: "Cinema, viagens, entretenimento", color: "#fd7e14", is_default: true },
    { id: 5, name: "Saúde", description: "Médicos, farmácia, plano de saúde", color: "#dc3545", is_default: true },
    { id: 6, name: "Educação", description: "Cursos, livros, material escolar", color: "#20c997", is_default: true },
    { id: 7, name: "Salário", description: "Salário principal", color: "#198754", is_default: true },
    { id: 8, name: "Freelance", description: "Trabalhos extras", color: "#0dcaf0", is_default: true }
  ]

  const mockAccounts = [
    { id: 1, name: "Conta Corrente Principal", account_type: "checking", bank_name: "Banco do Brasil", balance: 2500.00, credit_limit: null },
    { id: 2, name: "Cartão de Crédito Visa", account_type: "credit_card", bank_name: "Banco do Brasil", balance: 0, credit_limit: 5000.00 }
  ]

  const mockLimits = [
    { id: 1, category_id: 1, category: { name: "Alimentação", color: "#28a745" }, monthly_limit: 1000.00, current_spent: 800.00 },
    { id: 2, category_id: 4, category: { name: "Lazer", color: "#fd7e14" }, monthly_limit: 300.00, current_spent: 350.00 },
    { id: 3, category_id: 2, category: { name: "Transporte", color: "#007bff" }, monthly_limit: 500.00, current_spent: 450.00 }
  ]

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setCategories(mockCategories)
      setAccounts(mockAccounts)
      setSpendingLimits(mockLimits)
      setLoading(false)
    }, 1000)
  }, [])

  // Funções para categorias
  const handleAddCategory = () => {
    const category = {
      id: Date.now(),
      ...newCategory,
      is_default: false
    }
    setCategories([...categories, category])
    setIsCategoryDialogOpen(false)
    resetNewCategory()
  }

  const handleUpdateCategory = () => {
    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? { ...editingCategory, ...newCategory } : cat
    ))
    setEditingCategory(null)
    resetNewCategory()
  }

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter(cat => cat.id !== categoryId))
  }

  const resetNewCategory = () => {
    setNewCategory({ name: '', description: '', color: '#007bff' })
  }

  // Funções para contas
  const handleAddAccount = () => {
    const account = {
      id: Date.now(),
      ...newAccount,
      balance: parseFloat(newAccount.balance || 0),
      credit_limit: newAccount.credit_limit ? parseFloat(newAccount.credit_limit) : null
    }
    setAccounts([...accounts, account])
    setIsAccountDialogOpen(false)
    resetNewAccount()
  }

  const handleUpdateAccount = () => {
    const updatedAccount = {
      ...editingAccount,
      ...newAccount,
      balance: parseFloat(newAccount.balance || 0),
      credit_limit: newAccount.credit_limit ? parseFloat(newAccount.credit_limit) : null
    }
    setAccounts(accounts.map(acc => 
      acc.id === editingAccount.id ? updatedAccount : acc
    ))
    setEditingAccount(null)
    resetNewAccount()
  }

  const handleDeleteAccount = (accountId) => {
    setAccounts(accounts.filter(acc => acc.id !== accountId))
  }

  const resetNewAccount = () => {
    setNewAccount({
      name: '',
      account_type: 'checking',
      bank_name: '',
      balance: '',
      credit_limit: ''
    })
  }

  // Funções para limites
  const handleAddLimit = () => {
    const category = categories.find(cat => cat.id.toString() === newLimit.category_id)
    const limit = {
      id: Date.now(),
      ...newLimit,
      category_id: parseInt(newLimit.category_id),
      monthly_limit: parseFloat(newLimit.monthly_limit),
      current_spent: 0,
      category: { name: category.name, color: category.color }
    }
    setSpendingLimits([...spendingLimits, limit])
    setIsLimitDialogOpen(false)
    resetNewLimit()
  }

  const handleUpdateLimit = () => {
    const updatedLimit = {
      ...editingLimit,
      monthly_limit: parseFloat(newLimit.monthly_limit)
    }
    setSpendingLimits(spendingLimits.map(limit => 
      limit.id === editingLimit.id ? updatedLimit : limit
    ))
    setEditingLimit(null)
    resetNewLimit()
  }

  const handleDeleteLimit = (limitId) => {
    setSpendingLimits(spendingLimits.filter(limit => limit.id !== limitId))
  }

  const resetNewLimit = () => {
    setNewLimit({ category_id: '', monthly_limit: '' })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
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
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie categorias, contas e limites de gastos</p>
        </div>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="accounts">Contas</TabsTrigger>
          <TabsTrigger value="limits">Limites de Gastos</TabsTrigger>
          <TabsTrigger value="general">Geral</TabsTrigger>
        </TabsList>

        {/* Categorias */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Categorias</CardTitle>
                  <CardDescription>Gerencie as categorias de transações</CardDescription>
                </div>
                
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Categoria
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="cat_name">Nome</Label>
                        <Input
                          id="cat_name"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                          placeholder="Nome da categoria"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="cat_description">Descrição</Label>
                        <Textarea
                          id="cat_description"
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                          placeholder="Descrição da categoria"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="cat_color">Cor</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="cat_color"
                            type="color"
                            value={newCategory.color}
                            onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                            className="w-16 h-10"
                          />
                          <Input
                            value={newCategory.color}
                            onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                            placeholder="#007bff"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => {
                        setIsCategoryDialogOpen(false)
                        setEditingCategory(null)
                        resetNewCategory()
                      }}>
                        Cancelar
                      </Button>
                      <Button onClick={editingCategory ? handleUpdateCategory : handleAddCategory}>
                        {editingCategory ? 'Salvar' : 'Adicionar'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{category.name}</span>
                          {category.is_default && (
                            <Badge variant="secondary" className="text-xs">Padrão</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category)
                          setNewCategory({
                            name: category.name,
                            description: category.description,
                            color: category.color
                          })
                          setIsCategoryDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {!category.is_default && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contas */}
        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contas</CardTitle>
                  <CardDescription>Gerencie suas contas correntes e cartões de crédito</CardDescription>
                </div>
                
                <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Conta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingAccount ? 'Editar Conta' : 'Nova Conta'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="acc_name">Nome</Label>
                        <Input
                          id="acc_name"
                          value={newAccount.name}
                          onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                          placeholder="Nome da conta"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="acc_type">Tipo</Label>
                        <Select value={newAccount.account_type} onValueChange={(value) => setNewAccount({...newAccount, account_type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checking">Conta Corrente</SelectItem>
                            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="acc_bank">Banco</Label>
                        <Input
                          id="acc_bank"
                          value={newAccount.bank_name}
                          onChange={(e) => setNewAccount({...newAccount, bank_name: e.target.value})}
                          placeholder="Nome do banco"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="acc_balance">Saldo</Label>
                          <Input
                            id="acc_balance"
                            type="number"
                            step="0.01"
                            value={newAccount.balance}
                            onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
                            placeholder="0,00"
                          />
                        </div>
                        
                        {newAccount.account_type === 'credit_card' && (
                          <div className="grid gap-2">
                            <Label htmlFor="acc_limit">Limite</Label>
                            <Input
                              id="acc_limit"
                              type="number"
                              step="0.01"
                              value={newAccount.credit_limit}
                              onChange={(e) => setNewAccount({...newAccount, credit_limit: e.target.value})}
                              placeholder="0,00"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => {
                        setIsAccountDialogOpen(false)
                        setEditingAccount(null)
                        resetNewAccount()
                      }}>
                        Cancelar
                      </Button>
                      <Button onClick={editingAccount ? handleUpdateAccount : handleAddAccount}>
                        {editingAccount ? 'Salvar' : 'Adicionar'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {account.account_type === 'credit_card' ? (
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Building className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <p className="text-sm text-gray-500">
                          {account.bank_name} • {account.account_type === 'credit_card' ? 'Cartão de Crédito' : 'Conta Corrente'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(account.balance)}
                      </div>
                      {account.credit_limit && (
                        <p className="text-sm text-gray-500">
                          Limite: {formatCurrency(account.credit_limit)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingAccount(account)
                          setNewAccount({
                            name: account.name,
                            account_type: account.account_type,
                            bank_name: account.bank_name,
                            balance: account.balance.toString(),
                            credit_limit: account.credit_limit ? account.credit_limit.toString() : ''
                          })
                          setIsAccountDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteAccount(account.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Limites de Gastos */}
        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Limites de Gastos</CardTitle>
                  <CardDescription>Defina limites mensais por categoria</CardDescription>
                </div>
                
                <Dialog open={isLimitDialogOpen} onOpenChange={setIsLimitDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Limite
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingLimit ? 'Editar Limite' : 'Novo Limite'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="limit_category">Categoria</Label>
                        <Select value={newLimit.category_id} onValueChange={(value) => setNewLimit({...newLimit, category_id: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.filter(cat => !spendingLimits.some(limit => limit.category_id === cat.id)).map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="limit_amount">Limite Mensal</Label>
                        <Input
                          id="limit_amount"
                          type="number"
                          step="0.01"
                          value={newLimit.monthly_limit}
                          onChange={(e) => setNewLimit({...newLimit, monthly_limit: e.target.value})}
                          placeholder="0,00"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => {
                        setIsLimitDialogOpen(false)
                        setEditingLimit(null)
                        resetNewLimit()
                      }}>
                        Cancelar
                      </Button>
                      <Button onClick={editingLimit ? handleUpdateLimit : handleAddLimit}>
                        {editingLimit ? 'Salvar' : 'Adicionar'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {spendingLimits.map((limit) => (
                  <div key={limit.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: limit.category.color }}
                      />
                      <div>
                        <div className="font-medium">{limit.category.name}</div>
                        <p className="text-sm text-gray-500">
                          Gasto: {formatCurrency(limit.current_spent)} / {formatCurrency(limit.monthly_limit)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(limit.monthly_limit)}</div>
                        <div className={`text-sm ${limit.current_spent > limit.monthly_limit ? 'text-red-600' : 'text-green-600'}`}>
                          {((limit.current_spent / limit.monthly_limit) * 100).toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEditingLimit(limit)
                            setNewLimit({
                              category_id: limit.category_id.toString(),
                              monthly_limit: limit.monthly_limit.toString()
                            })
                            setIsLimitDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteLimit(limit.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações Gerais */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configurações do sistema e preferências</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currency">Moeda</Label>
                  <Select defaultValue="BRL">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                      <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="date_format">Formato de Data</Label>
                  <Select defaultValue="DD/MM/YYYY">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="theme">Tema</Label>
                  <Select defaultValue="light">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Importar Dados de Exemplo</CardTitle>
              <CardDescription>Carregue dados de exemplo para testar o sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">
                Importar Dados de Exemplo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

