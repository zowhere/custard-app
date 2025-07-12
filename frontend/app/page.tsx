import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white">
        <CardHeader className="text-center pb-8 pt-8">
          <CardTitle className="text-2xl font-light text-gray-800 tracking-wide">welcome to custard wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="email"
              className="h-12 border-gray-200 focus:border-yellow-300 focus:ring-yellow-200 placeholder:text-gray-400 text-gray-700"
            />
          </div>
          <div className="space-y-3 pt-2">
            <Button
              className="w-full h-12 bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-medium border-0 shadow-sm transition-colors"
              type="submit"
            >
              sign in
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 border-yellow-200 text-gray-700 hover:bg-yellow-50 hover:border-yellow-300 font-medium transition-colors bg-transparent"
            >
              connect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
