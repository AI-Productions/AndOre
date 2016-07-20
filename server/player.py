import uuid, random


class Player:

    def __init__(self, _id, _world):
        assert(_world is not None)

        self.id = _id
        self.world = _world
        self.health = 100
        self.ore_quantity = 0
        self.inner_icon = '@'
        self.icon = '!'
        self.x_position = self.generate_starting_x_position()
        self.y_position = self.generate_starting_y_position()

    def input(self, _dir):
        if _dir == 'w':
            self.y_position = move_in_bounds(self.y_position + 1, 'col')
        elif _dir == 's':
            self.y_position = move_in_bounds(self.y_position - 1, 'col')
        elif _dir == 'a':
            self.x_position = move_in_bounds(self.x_position - 1, 'row')
        elif _dir == 'd':
            self.x_position = move_in_bounds(self.x_position + 1, 'row')

    def line_of_stats(self):
        return 'hp: {health} ore: {ore} x: {x} y: {y}'.format(health=self.health,
                                                              ore=self.ore_quantity,
                                                              x=self.x_position,
                                                              y=self.y_position)

    def world_state(self):
        los = self.line_of_stats().ljust(self.world.rows)
        los = list(los)
        worldmap = self.world.get_world()
        worldmap.append(los)
        return worldmap

    def generate_starting_x_position(self):
        return random.randint(0, self.world.rows)

    def generate_starting_y_position(self):
        return random.randint(0, self.world.cols)
