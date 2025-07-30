import { useState, useRef } from 'react'
import { 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  X,
  Loader2,
  Eye
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import ApiService from '../services/api'

export function ImportTransactions() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setImportResult(null)
      setPreviewData(null)
      setShowPreview(false)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setImportResult(null)
      setPreviewData(null)
      setShowPreview(false)
    }
  }

  const validateFile = async () => {
    if (!selectedFile) return

    try {
      setIsUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await ApiService.validateImportFile(formData)
      
      if (response.success) {
        setPreviewData(response.data)
        setShowPreview(true)
      } else {
        setError(response.error)
      }
    } catch (error) {
      setError('Erro ao validar arquivo: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const importTransactions = async () => {
    if (!selectedFile) return

    try {
      setIsUploading(true)
      setError(null)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append('file', selectedFile)

      // Simular progresso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await ApiService.importTransactions(formData)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.success) {
        setImportResult(response.data)
        setSelectedFile(null)
        setPreviewData(null)
        setShowPreview(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setError(response.error)
      }
    } catch (error) {
      setError('Erro ao importar transações: ' + error.message)
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/import/download-template')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'template_importacao_transacoes.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      setError('Erro ao baixar template: ' + error.message)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getSupportedFormats = () => {
    return ['.csv']  // Apenas CSV por enquanto
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Importar Transações</h1>
        <p className="text-gray-600">
          Importe suas transações em massa via arquivo CSV
        </p>
      </div>

      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Template de Importação
          </CardTitle>
          <CardDescription>
            Baixe o template para organizar seus dados no formato correto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Colunas Obrigatórias:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>data:</strong> Data da transação (DD/MM/AAAA)</li>
                  <li>• <strong>descricao:</strong> Descrição da transação</li>
                  <li>• <strong>valor:</strong> Valor (positivo para receitas, negativo para despesas)</li>
                  <li>• <strong>tipo:</strong> receita/entrada ou despesa/saida</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Colunas Opcionais:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>categoria:</strong> Categoria da transação</li>
                  <li>• <strong>conta:</strong> Conta ou cartão</li>
                  <li>• <strong>observacoes:</strong> Observações adicionais</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">Formatos suportados:</Badge>
              {getSupportedFormats().map(format => (
                <Badge key={format} variant="secondary">{format}</Badge>
              ))}
            </div>

            <Button onClick={downloadTemplate} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Baixar Template CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Arquivo
          </CardTitle>
          <CardDescription>
            Selecione ou arraste seu arquivo de transações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                selectedFile 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewData(null)
                      setShowPreview(false)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remover
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium">
                      Arraste seu arquivo aqui ou clique para selecionar
                    </p>
                    <p className="text-sm text-gray-500">
                      Suporte para CSV (máximo 10MB)
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Selecionar Arquivo
                  </Button>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Action Buttons */}
            {selectedFile && (
              <div className="flex gap-2">
                <Button
                  onClick={validateFile}
                  disabled={isUploading}
                  variant="outline"
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Eye className="mr-2 h-4 w-4" />
                  )}
                  Visualizar Dados
                </Button>
                
                <Button
                  onClick={importTransactions}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Importar Transações
                </Button>
              </div>
            )}

            {/* Progress Bar */}
            {isUploading && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso da importação</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Data */}
      {showPreview && previewData && (
        <Card>
          <CardHeader>
            <CardTitle>Prévia dos Dados</CardTitle>
            <CardDescription>
              {previewData.total_rows} linha(s) encontrada(s). Mostrando as primeiras 5:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Columns Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Colunas Encontradas:</h4>
                  <div className="flex flex-wrap gap-1">
                    {previewData.columns_found.map(col => (
                      <Badge 
                        key={col} 
                        variant={previewData.required_columns.includes(col) ? "default" : "secondary"}
                      >
                        {col}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Status:</h4>
                  <div className="space-y-1">
                    {previewData.required_columns.map(col => (
                      <div key={col} className="flex items-center gap-2 text-sm">
                        {previewData.columns_found.includes(col) ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className={previewData.columns_found.includes(col) ? "text-green-600" : "text-red-600"}>
                          {col} {previewData.columns_found.includes(col) ? "✓" : "✗"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      {previewData.columns_found.map(col => (
                        <th key={col} className="border border-gray-300 px-4 py-2 text-left font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.preview.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        {previewData.columns_found.map(col => (
                          <td key={col} className="border border-gray-300 px-4 py-2 text-sm">
                            {row[col] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Result */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Importação Concluída
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {importResult.successful_imports}
                  </div>
                  <div className="text-sm text-green-700">Importadas</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {importResult.failed_imports}
                  </div>
                  <div className="text-sm text-red-700">Falharam</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {importResult.total_rows}
                  </div>
                  <div className="text-sm text-blue-700">Total</div>
                </div>
              </div>

              {/* Errors */}
              {importResult.errors && importResult.errors.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Erros encontrados:</h4>
                  <div className="bg-red-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700 mb-1">
                        • {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {importResult.warnings && importResult.warnings.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-yellow-600">Avisos:</h4>
                  <div className="bg-yellow-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                    {importResult.warnings.map((warning, index) => (
                      <div key={index} className="text-sm text-yellow-700 mb-1">
                        • {warning}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Atualizar Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

