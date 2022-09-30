<Grid container alignItems={"center"} spacing={2}>
      <Grid item xs={12} md={3} lg={3} sx={{paddingLeft : 100}}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              value={name}
              onChange={onChangeName}
              label="Name"
              name="name"
              autoFocus
            />
            </ListItem>
            <ListItem divider/>
            <ListItem>
              <Grid container>
              <Grid item><Box sx={{ width: 200 }} >
              <Grid container spacing={2} sx={{paddingTop : 2}} >
                <Grid item xs={6}>
                  <TextField
                    id="standard-basic"
                    label="Price"
                    required
                    onChange={onChangePrice}
                    value={price}
                    fullWidth={true}
                    />
                </Grid>
              </Grid>
            </Box></Grid>
                <Grid item sx={{paddingTop : 2}} ><FormGroup>
              <FormControlLabel control={<Checkbox sx={{ color: green[800], '&.Mui-checked': { color: green[600] } }} defaultChecked />} label="Veg" />
              <FormControlLabel control={<Checkbox sx={{ color: red[800], '&.Mui-checked': { color: red[600] } }} />} label="Non-Veg" />
            </FormGroup></Grid>
              </Grid>
            </ListItem>
            <ListItem divider/>
            <ListItem>
              <Grid container >
                <Grid item>
                <InputLabel id="demo-multiple-chip-label">Tags</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={tag}
                  onChange={addTag}
                  sx={{ minWidth: 150, mb: 0.5 }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {tags.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, tag, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
                </Grid>
                <Grid item sx={{paddingLeft : 2}}>
                <InputLabel id="shop-multiple-chip-label">Shop</InputLabel>
                <Select
                  labelId="shop-multiple-chip-label"
                  id="shop-multiple-chip"
                  multiple
                  value={shop}
                  onChange={addShop}
                  sx={{ minWidth: 150, mb: 0.5 }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {shops.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, tag, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
            <Grid item >
                <List component="nav" aria-label="mailbox folders">
                  <ListItem text sx={{paddingLeft : 15}}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      
                    >Add item
                    </Button>
                  </ListItem>
                </List>
              </Grid>
            </ListItem>
          </List>
        </Grid>
      </Grid>