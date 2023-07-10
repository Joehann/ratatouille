import { app } from "@ratatouille/modules/app/main"
import { Dependencies } from "@ratatouille/modules/store/dependencies"
import React, { createContext, useContext } from "react"

const DependenciesContext = createContext<Dependencies>(null as any)

export const DependenciesProvider: React.FC<{
  dependencies: Dependencies
  children: React.ReactNode
}> = ({ dependencies, children }) => {
  return (
    <DependenciesContext.Provider value={app.dependencies}>
      {children}
    </DependenciesContext.Provider>
  )
}

export const useDependencies = () => useContext(DependenciesContext)
