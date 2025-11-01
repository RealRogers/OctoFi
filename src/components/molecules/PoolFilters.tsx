/**
 * PoolFilters Component
 * Filters and search controls for pool list
 */

import { Search, X } from 'lucide-react'
import { PoolFilters as PoolFiltersType } from '@/types/staking'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { LOCK_PERIOD_OPTIONS } from '@/lib/stakingConstants'

interface PoolFiltersProps {
  filters: PoolFiltersType
  onFilterChange: <K extends keyof PoolFiltersType>(key: K, value: PoolFiltersType[K]) => void
  onReset: () => void
  hasFilters: boolean
}

export const PoolFilters: React.FC<PoolFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  hasFilters
}) => {
  return (
    <div className="space-y-4 p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by name or symbol..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* APY Range */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>APY Range</Label>
          <span className="text-sm text-muted-foreground">
            {filters.minAPY}% - {filters.maxAPY}%
          </span>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="minAPY" className="text-xs">Min APY</Label>
            <Slider
              id="minAPY"
              min={0}
              max={100}
              step={1}
              value={[filters.minAPY]}
              onValueChange={(value) => onFilterChange('minAPY', value[0])}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="maxAPY" className="text-xs">Max APY</Label>
            <Slider
              id="maxAPY"
              min={0}
              max={100}
              step={1}
              value={[filters.maxAPY]}
              onValueChange={(value) => onFilterChange('maxAPY', value[0])}
            />
          </div>
        </div>
      </div>

      {/* TVL Range */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="minTVL">Min TVL</Label>
          <span className="text-sm text-muted-foreground">
            ${filters.minTVL.toLocaleString()}
          </span>
        </div>
        <Slider
          id="minTVL"
          min={0}
          max={10000000}
          step={10000}
          value={[filters.minTVL]}
          onValueChange={(value) => onFilterChange('minTVL', value[0])}
        />
      </div>

      {/* Lock Period */}
      <div className="space-y-2">
        <Label htmlFor="lockPeriod">Lock Period</Label>
        <Select
          value={filters.lockPeriod}
          onValueChange={(value) => onFilterChange('lockPeriod', value as any)}
        >
          <SelectTrigger id="lockPeriod">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LOCK_PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* AI Predictions */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="showAIPredictions"
          checked={filters.showAIPredictions}
          onCheckedChange={(checked) => 
            onFilterChange('showAIPredictions', checked as boolean)
          }
        />
        <Label
          htmlFor="showAIPredictions"
          className="text-sm font-normal cursor-pointer"
        >
          Show AI Predictions Only
        </Label>
      </div>
    </div>
  )
}
