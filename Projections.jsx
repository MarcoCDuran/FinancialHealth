import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  DollarSign,
  AlertCircle,
  Info
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts'

export function Projections() {
  const [projectionsData, setProjectionsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjectionsData()
  }, [])

  const fetchProjectionsData = async () => {
    try {
      // Dados mockados para demonstração
      const mockData = {
        expense_projections: {
          "2025-02": {
            year: 2025,
            month: 2,
            month_name: "February",
            recurring_expenses: 2800.00,
            historical_average: 3200.00,
            projected_total: 3080.00,
            projected_by_category: {
              "Alimentação": 850.00,
              "Transporte": 480.00,
              "Moradia": 1200.00,
              "Lazer": 300.00,
              "Saúde": 150.00,
              "Educação": 100.00
            }
          },
          "2025-03": {
            year: 2025,
            month: 3,
            month_name: "March",
            recurring_expenses: 2800.00,
            historical_average: 3100.00,
            projected_total: 3040.00,
            projected_by_category: {
              "Alimentação": 820.00,
              "Transporte": 460.00,
              "Moradia": 1200.00,
              "Lazer": 320.00,
              "Saúde": 140.00,
              "Educação": 100.00
            }
          },
          "2025-04": {
            year: 2025,
            month: 4,
            month_name: "April",
            recurring_expenses: 2800.00,
            historical_average: 3300.00,
            projected_total: 3140.00,
            projected_by_category: {
              "Alimentação": 880.00,
              "Transporte": 500.00,
              "Moradia": 1200.00,
              "Lazer": 350.00,
              "Saúde": 110.00,
              "Educação": 100.00
            }
          }
        },
        income_projections: {
          "2025-02": {
            year: 2025,
            month: 2,
            month_name: "February",
            recurring_income: 5500.00,
            historical_average: 5800.00,
            projected_total: 5650.00
          },
          "2025-03": {
            year: 2025,
            month: 3,
            month_name: "March",
            recurring_income: 5500.00,
            historical_average: 5600.00,
            projected_total: 5550.00
          },
          "2025-04": {
            year: 2025,
            month: 4,
            month_name: "April",
            recurring_income: 5500.00,
            historical_average: 5900.00,
            projected_total: 5700.00
          }
        },
        savings_capacity: {
          "2025-02": {
            month: "February",
            year: 2025,
            projected_income: 5650.00,
            projected_expenses: 3080.00,
            projected_savings: 2570.00,
            savings_rate: 45.5
          },
          "2025-03": {
            month: "March",
            year: 2025,
            projected_income: 5550.00,
            projected_expenses: 3040.00,
            projected_savings: 2510.00,
            savings_rate: 45.2
          },
          "2025-04": {
            month: "April",
            year: 2025,
            projected_income: 5700.00,
            projected_expenses: 3140.00,
            projected_savings: 2560.00,
            savings_rate: 44.9
          }
        }
      }
      
      setProjectionsData(mockData)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar projeções:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!projectionsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Erro ao carregar projeções</p>
      </div>
    )
  }

  const { expense_projections, income_projections, savings_capacity } = projectionsData

  // Preparar dados para gráficos
  const monthlyProjectionData = Object.keys(expense_projections).map(monthKey => {
    const expense = expense_projections[monthKey]
    const income = income_projections[monthKey]
    const savings = savings_capacity[monthKey]
    
    return {
      month: expense.month_name.substring(0, 3),
      receitas: income.projected_total,
      despesas: expense.projected_total,
      economia: savings.projected_savings,
      taxa_economia: savings.savings_rate
    }
  })

  const expensesByCategoryData = Object.keys(expense_projections).map(monthKey => {
    const expense = expense_projections[monthKey]
    return {
      month: expense.month_name.substring(0, 3),
      ...expense.projected_by_category
    }
  })

  const categories = Object.keys(expense_projections[Object.keys(expense_projections)[0]].projected_by_category)
  const categoryColors = {
    "Alimentação": "#28a745",
    "Transporte": "#007bff", 
    "Moradia": "#6f42c1",
    "Lazer": "#fd7e14",
    "Saúde": "#dc3545",
    "Educação": "#20c997"
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projeções Financeiras</h1>
          <p className="text-gray-600">Análise e previsões para os próximos meses</p>
        </div>
      </div>

      {/* Cards de Resumo das Projeções */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(savings_capacity).map(([monthKey, data]) => (
          <Card key={monthKey}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{data.month} {data.year}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Receitas</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(data.projected_income)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Despesas</span>
                <span className="font-medium text-red-600">
                  {formatCurrency(data.projected_expenses)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">Economia</span>
                <div className="text-right">
                  <div className="font-bold text-blue-600">
                    {formatCurrency(data.projected_savings)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.savings_rate.toFixed(1)}% da renda
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs para diferentes visualizações */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="expenses">Despesas por Categoria</TabsTrigger>
          <TabsTrigger value="details">Detalhes por Mês</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Gráfico de Projeção Geral */}
          <Card>
            <CardHeader>
              <CardTitle>Projeção de Receitas, Despesas e Economia</CardTitle>
              <CardDescription>Comparativo dos próximos 3 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyProjectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="receitas" 
                    stackId="1" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                    name="Receitas"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="despesas" 
                    stackId="2" 
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.6}
                    name="Despesas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="economia" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="Economia"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Taxa de Poupança */}
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Poupança Projetada</CardTitle>
              <CardDescription>Percentual da renda que será poupado</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyProjectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Line 
                    type="monotone" 
                    dataKey="taxa_economia" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                    name="Taxa de Poupança (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          {/* Gráfico de Despesas por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle>Projeção de Despesas por Categoria</CardTitle>
              <CardDescription>Distribuição esperada dos gastos por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={expensesByCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  {categories.map((category) => (
                    <Bar 
                      key={category}
                      dataKey={category} 
                      fill={categoryColors[category] || '#8884d8'}
                      name={category}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {/* Detalhes por Mês */}
          {Object.entries(expense_projections).map(([monthKey, expenseData]) => {
            const incomeData = income_projections[monthKey]
            const savingsData = savings_capacity[monthKey]
            
            return (
              <Card key={monthKey}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{expenseData.month_name} {expenseData.year}</span>
                    <Badge variant="outline">
                      {savingsData.savings_rate.toFixed(1)}% de economia
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Receitas */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-green-700 flex items-center">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Receitas Projetadas
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Receitas Recorrentes:</span>
                          <span className="font-medium">{formatCurrency(incomeData.recurring_income)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Média Histórica:</span>
                          <span className="font-medium">{formatCurrency(incomeData.historical_average)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Total Projetado:</span>
                          <span className="font-bold text-green-600">{formatCurrency(incomeData.projected_total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Despesas */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-red-700 flex items-center">
                        <TrendingDown className="mr-2 h-4 w-4" />
                        Despesas Projetadas
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Despesas Recorrentes:</span>
                          <span className="font-medium">{formatCurrency(expenseData.recurring_expenses)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Média Histórica:</span>
                          <span className="font-medium">{formatCurrency(expenseData.historical_average)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Total Projetado:</span>
                          <span className="font-bold text-red-600">{formatCurrency(expenseData.projected_total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Despesas por Categoria */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Distribuição por Categoria</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(expenseData.projected_by_category).map(([category, amount]) => (
                        <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{category}</span>
                          <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>

      {/* Alertas e Observações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5 text-blue-600" />
            Observações sobre as Projeções
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p>
                As projeções são baseadas no histórico dos últimos 6 meses e nas transações recorrentes cadastradas.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p>
                Eventos sazonais, mudanças de hábitos ou despesas extraordinárias podem afetar a precisão das projeções.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>
                Sua taxa de poupança projetada está acima de 40%, o que indica uma boa saúde financeira.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

