import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import ApiService from '../services/api'

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const response = await ApiService.getDashboard()
      if (response.success) {
        setDashboardData(response.data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      // Usar dados mockados em caso de erro
      setDashboardData(getMockData())
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadDashboardData()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount || 0)
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  const getHealthLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'excelente': return 'text-green-600'
      case 'boa': return 'text-blue-600'
      case 'regular': return 'text-yellow-600'
      case 'ruim': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getHealthLevelBadgeColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'excelente': return 'bg-green-100 text-green-800'
      case 'boa': return 'bg-blue-100 text-blue-800'
      case 'regular': return 'bg-yellow-100 text-yellow-800'
      case 'ruim': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Preparar dados para os gráficos
  const prepareExpenseChartData = () => {
    if (!dashboardData?.current_month_summary?.expenses_by_category) return []
    
    const expenses = dashboardData.current_month_summary.expenses_by_category
    return Object.entries(expenses).map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: dashboardData.current_month_summary.total_expenses > 0 
        ? ((amount / dashboardData.current_month_summary.total_expenses) * 100).toFixed(1)
        : 0
    }))
  }

  const prepareProjectionChartData = () => {
    if (!dashboardData?.savings_capacity) return []
    
    return Object.entries(dashboardData.savings_capacity).map(([key, data]) => ({
      month: data.month?.substring(0, 3) || 'N/A',
      receitas: data.projected_income || 0,
      despesas: data.projected_expenses || 0,
      economia: data.projected_savings || 0
    }))
  }

  const prepareLimitsData = () => {
    if (!dashboardData?.spending_limits_status) return []
    
    return dashboardData.spending_limits_status.map(limit => ({
      ...limit,
      percentage: limit.monthly_limit > 0 ? (limit.current_spent / limit.monthly_limit) * 100 : 0,
      status: limit.current_spent > limit.monthly_limit ? 'Excedido' : 
              limit.current_spent > limit.monthly_limit * 0.8 ? 'Atenção' : 'OK'
    }))
  }

  const prepareGoalsData = () => {
    if (!dashboardData?.goals_progress) return []
    
    return dashboardData.goals_progress.map(goal => ({
      ...goal,
      progress_percentage: goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0
    }))
  }

  // Dados mockados para fallback
  const getMockData = () => ({
    current_month_summary: {
      period: "01/07/2025 - 24/07/2025",
      total_income: 5500.00,
      total_expenses: 3200.50,
      partial_balance: 2299.50,
      expenses_by_category: {
        "Alimentação": 800.00,
        "Transporte": 450.00,
        "Moradia": 1200.00,
        "Lazer": 350.00,
        "Saúde": 250.00,
        "Educação": 150.50
      }
    },
    health_score: {
      total_score: 72.5,
      health_level: "Boa",
      recommendations: [
        "Revise e ajuste seus limites de gastos por categoria",
        "Continue mantendo o saldo positivo"
      ]
    },
    savings_capacity: {
      "2025-08": { month: "August", projected_income: 5650, projected_expenses: 3080, projected_savings: 2570 },
      "2025-09": { month: "September", projected_income: 5550, projected_expenses: 3040, projected_savings: 2510 },
      "2025-10": { month: "October", projected_income: 5700, projected_expenses: 3140, projected_savings: 2560 }
    },
    spending_limits_status: [
      { category: { name: "Alimentação", color: "#28a745" }, monthly_limit: 1000, current_spent: 800 },
      { category: { name: "Lazer", color: "#fd7e14" }, monthly_limit: 300, current_spent: 350 },
      { category: { name: "Transporte", color: "#007bff" }, monthly_limit: 500, current_spent: 450 }
    ],
    goals_progress: [
      { 
        id: 1, 
        name: "Viagem para Europa", 
        target_amount: 8000, 
        current_amount: 2400,
        target_date: "2025-09-15",
        months_remaining: 8.5
      },
      { 
        id: 2, 
        name: "Reserva de Emergência", 
        target_amount: 15000, 
        current_amount: 5500,
        target_date: "2026-01-31",
        months_remaining: 12.0
      }
    ]
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const data = dashboardData || getMockData()
  const expenseChartData = prepareExpenseChartData()
  const projectionChartData = prepareProjectionChartData()
  const limitsData = prepareLimitsData()
  const goalsData = prepareGoalsData()

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
          <p className="text-gray-600">
            Período: {data.current_month_summary?.period || 'N/A'}
          </p>
        </div>
        
        <Button onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data.current_month_summary?.total_income)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(data.current_month_summary?.total_expenses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Parcial</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.current_month_summary?.partial_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(data.current_month_summary?.partial_balance)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saúde Financeira</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthLevelColor(data.health_score?.health_level)}`}>
              {data.health_score?.total_score?.toFixed(1) || '0.0'}
            </div>
            <Badge className={getHealthLevelBadgeColor(data.health_score?.health_level)}>
              {data.health_score?.health_level || 'N/A'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Despesas por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
            <CardDescription>Distribuição dos gastos no mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Projeção dos Próximos Meses */}
        <Card>
          <CardHeader>
            <CardTitle>Projeção dos Próximos Meses</CardTitle>
            <CardDescription>Receitas, despesas e economia projetadas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={projectionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="receitas" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="despesas" stackId="2" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="economia" stackId="3" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status dos Limites de Gastos */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Limites de Gastos</CardTitle>
          <CardDescription>Acompanhe seus gastos por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {limitsData.map((limit, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: limit.category?.color || '#6b7280' }}
                  />
                  <span className="font-medium">{limit.category?.name || limit.category_name}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm">
                      {formatCurrency(limit.current_spent)} / {formatCurrency(limit.monthly_limit)}
                    </div>
                    <Progress 
                      value={limit.percentage} 
                      className="w-24 h-2"
                    />
                  </div>
                  
                  <Badge 
                    className={
                      limit.status === 'Excedido' ? 'bg-red-100 text-red-800' :
                      limit.status === 'Atenção' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }
                  >
                    {limit.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progresso das Metas */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso das Metas</CardTitle>
          <CardDescription>Acompanhe o progresso dos seus objetivos financeiros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {goalsData.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{goal.name}</h4>
                  <span className="text-sm text-gray-500">
                    {goal.progress_percentage?.toFixed(1)}% concluído
                  </span>
                </div>
                
                <Progress value={goal.progress_percentage} className="h-2" />
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                  </span>
                  <span>
                    {goal.months_remaining?.toFixed(1)} meses restantes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações</CardTitle>
          <CardDescription>Sugestões para melhorar sua saúde financeira</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {(data.health_score?.recommendations || []).map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

